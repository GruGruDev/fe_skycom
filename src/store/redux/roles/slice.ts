import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "apis/user";
import map from "lodash/map";
import { RootState, store } from "store";
import { TRole } from "types/Permission";
import { TSelectOption } from "types/SelectOption";

export interface RoleState {
  roles: {
    [key: string]: any;
  };
  roleSelectOptions: TSelectOption[];
  listRoles: TRole[];
  loading: boolean;
  error: boolean;
}

const initialState: RoleState = {
  roles: {},
  roleSelectOptions: [],
  listRoles: [],
  loading: false,
  error: false,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  // The reducers field lets us define reducers and generate associated actions
  reducers: {
    setRoles: (state: RoleState, action: any) => {
      state.roles = action.payload;
      state.listRoles = Object.values(action.payload);
    },
    createRoleSuccess: (state: RoleState, action: { payload: typeof state.roles }) => {
      state.roles = { ...state.roles, ...action.payload };

      const id = Object.keys(action.payload)[0];
      state.listRoles = [
        ...state.listRoles.filter((item) => +item.id !== +id),
        { ...action.payload?.[id] },
      ];
    },
    updateRoleSuccess: (state: RoleState, action: { payload: typeof state.roles }) => {
      state.roles = { ...state.roles, ...action.payload };

      const id = Object.keys(action.payload)[0];
      state.listRoles = [
        ...state.listRoles.filter((item) => item.id !== id),
        { ...action.payload?.[id] },
      ];
    },
    setRoleOptions: (state: RoleState, action: { payload: typeof state.roleSelectOptions }) => {
      state.roleSelectOptions = action.payload;
    },
    createRoleOptionsSuccess: (
      state: RoleState,
      action: {
        payload: {
          label: string;
          value: string;
          default_router: string;
        };
      },
    ) => {
      state.roleSelectOptions = [...state.roleSelectOptions, action.payload];
    },
    updateRoleOptionsSuccess: (
      state: RoleState,
      action: {
        payload: {
          label: string;
          value: string;
          default_router: string;
        };
      },
    ) => {
      const itemIndex = state.roleSelectOptions.findIndex(
        (item) => item.value === action.payload.value,
      );
      if (itemIndex) {
        state.roleSelectOptions.splice(itemIndex, 1, action.payload);
      }
    },
  },
});

export const rolesStore = (state: RootState) => state.roles;
export default rolesSlice.reducer;
export const {
  setRoles,
  setRoleOptions,
  createRoleOptionsSuccess,
  createRoleSuccess,
  updateRoleSuccess,
  updateRoleOptionsSuccess,
} = rolesSlice.actions;

export const createRoleAction = async (role: {
  name?: string;
  data?: any;
  default_router?: string | null;
}) => {
  const result = await userApi.create<any>({ endpoint: "role/", payload: role });
  if (result.data) {
    const { id, name, data, default_router } = result.data;
    store.dispatch(createRoleOptionsSuccess({ label: name, value: id.toString(), default_router }));
    store.dispatch(createRoleSuccess({ [id]: { data, default_router, name, id } }));
    return true;
  }
  return false;
};

export const updateRoleAction = async (role: {
  id?: string | number;
  name?: string;
  data?: any;
  default_router?: string | null;
}) => {
  const result = await userApi.update<any>({
    endpoint: `role/${role.id}/`,
    payload: role,
  });
  if (result.data) {
    const { id, name, data, default_router } = result.data;
    store.dispatch(updateRoleOptionsSuccess({ label: name, value: id.toString(), default_router }));
    store.dispatch(updateRoleSuccess({ [id]: { data, default_router, name, id } }));
    return true;
  }
  return false;
};

export const getRolesAction = async () => {
  const result = await userApi.get<TRole>({ endpoint: "role/", params: { limit: 1000 } });
  if (result.data?.results) {
    const roleSelectOptions = map(result.data.results, (item) => ({
      label: item?.name,
      value: item?.id?.toString(),
      default_router: item.default_router,
    }));
    const rolesFormat: any = {};
    map(
      result.data.results,
      (item: { id: number; name: string; data: any; default_router: string | null }) => {
        rolesFormat[item.id] = item;
        return;
      },
    );

    store.dispatch(setRoleOptions(roleSelectOptions));
    store.dispatch(setRoles(rolesFormat));
  }
};
