import { authApi } from "apis/auth";
import { userApi } from "apis/user";
import { ACTION_NAME } from "constants/activity";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import reduce from "lodash/reduce";
import { ReactNode, createContext, useCallback, useEffect, useReducer } from "react";
import { store } from "store";
import { getProductAttributes } from "store/redux/products/action";
import { getRolesAction } from "store/redux/roles/slice";
import { getDepartment } from "store/redux/settings/slice";
import { fetchUser } from "store/redux/users/action";
import { fetchAllUserRes } from "store/redux/users/slice";
import { ACTION_TYPE } from "types/Activity";
import { ActionMap, TAuthState, TJWTContext } from "types/Auth";
import { TUser } from "types/User";
import { getStorage, setStorage } from "utils/asyncStorage";
import { resetStorage } from "utils/resetStorage";

// ----------------------------------------------------------------------

enum Types {
  Initial = "INITIALIZE",
  Login = "LOGIN",
  Update_Profile = "UPDATE_PROFILE",
  Logout = "LOGOUT",
  Register = "REGISTER",
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: Partial<TUser> | null;
  };
  [Types.Login]: {
    user: Partial<TUser> | null;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: Partial<TUser> | null;
  };
  [Types.Update_Profile]: {
    user: Partial<TUser> | null;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: TAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: TAuthState, action: JWTActions) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<TJWTContext | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  const { users, isSyncRole } = useAppSelector(getDraftSafeSelector("users"));
  const roles = useAppSelector(getDraftSafeSelector("roles")).listRoles;

  const getToken = useCallback(async () => {
    const refreshToken = getStorage("refresh-token");
    if (refreshToken) {
      const result = await authApi.refreshToken({ refresh: refreshToken });
      if (result.data) {
        const { access, refresh } = result.data;
        sessionStorage.setItem("access-token", access);
        setStorage("refresh-token", refresh);
        if (access) {
          getProfile();
        } else logout();
      } else {
        logout();
      }
    } else logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const permissionCallApi = useCallback(async () => {
    // get cho toàn bộ ứng dụng
    await Promise.all([fetchUser(), getRolesAction(), getProductAttributes(), getDepartment()]);
  }, []);

  const loginLog = async (user: Partial<TUser>) => {
    await userApi.create({
      endpoint: "action-log/",
      payload: {
        user: user.id,
        action_name: ACTION_NAME.LOGIN,
        action_type: ACTION_TYPE.Login,
        message: `Tài khoản ${user.name} đăng nhập`,
      },
      message: null,
    });
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await authApi.login({ email, password });
      const { data } = response;
      if (data) {
        sessionStorage.setItem("access-token", data.access);
        setStorage("refresh-token", data.refresh);
        const profile = await authApi.getProfile();
        if (profile.data) {
          await permissionCallApi();
          loginLog(profile.data);

          dispatch({
            type: Types.Login,
            payload: {
              user: profile?.data,
            },
          });
        }
      }
    } catch (error) {
      Promise.reject(error);
    }
  };

  const logoutLog = async (user: Partial<TUser>) => {
    await userApi.create({
      endpoint: "action-log/",
      payload: {
        user: user.id,
        action_name: ACTION_NAME.LOGOUT,
        action_type: ACTION_TYPE.Logout,
        message: `Tài khoản ${user.name} đăng xuất`,
      },
      message: null,
    });
  };

  const logout = async () => {
    state.user && logoutLog(state.user);

    resetStorage();
    // deleteStorage("access-token");
    // deleteStorage("refresh-token");
    dispatch({ type: Types.Logout });
  };

  const updateProfile = (user: Partial<TUser>) => {
    dispatch({
      type: Types.Update_Profile,
      payload: {
        user: {
          ...state.user,
          ...user,
        },
      },
    });
  };

  const getProfile = useCallback(async () => {
    {
      const profileRes = await authApi.getProfile();
      const { data } = profileRes;
      if (data) {
        await permissionCallApi();

        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: true,
            user: data,
          },
        });
      } else {
        getToken();
      }
    }
  }, [getToken, permissionCallApi]);

  const initialize = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh-token");
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: true,
          user: null,
        },
      });

      if (refreshToken) {
        getProfile();
      } else {
        logout();
      }
    } catch (err) {
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [getProfile]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const matchRoleIntoUser = useCallback(() => {
    if (!isSyncRole && users.length && roles.length) {
      const userMatchRoles = reduce(
        users,
        (prev: TUser[], cur) => {
          const { email = "", password = "", name = "" } = cur;

          if (roles.length && cur.role?.data) {
            return [...prev, cur];
          }
          const role = find(roles, (item) => item.id === cur?.role?.toString());
          return [...prev, { ...cur, email, password, name, role }];
        },
        [],
      );
      store.dispatch(fetchAllUserRes({ users: userMatchRoles, isSyncRole: true }));
    }
    // điều kiện: lần đầu lấy danh sách user hoặc khi roles thay đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, roles]);

  // gắn quyền vào user
  useEffect(() => {
    matchRoleIntoUser();
  }, [matchRoleIntoUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        updateProfile,
        initialize,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
