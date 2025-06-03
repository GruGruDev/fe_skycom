import { createSlice } from "@reduxjs/toolkit";
import { ROLE_CUSTOMER, ROLE_ORDER, ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import filter from "lodash/filter";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";
import { forOf } from "utils/forOf";
import { checkPermission } from "utils/roleUtils";

export interface UserState {
  loading: boolean;
  users: TUser[];
  userOptions: TSelectOption[];
  telesaleUsers: TUser[];
  telesaleUserOptions: TSelectOption[];
  telesaleOnlineUsers: TUser[];
  handleLeadUsers: TUser[];
  handleOrderUsers: TUser[];
  handlePromotionUsers: TUser[];
  handleCustomerUsers: TUser[];
  handleWarehouseUsers: TUser[];
  activeUsers: TUser[];
  isSuccessAction?: "success" | "failed";
  message: string;
  isSyncRole?: boolean;
  isShowWelcome: boolean;
}

const initialState: UserState = {
  loading: false,
  isSyncRole: false,
  isSuccessAction: undefined,
  message: "",
  isShowWelcome: false,
  users: [],
  userOptions: [],
  activeUsers: [],
  handleLeadUsers: [],
  handleOrderUsers: [],
  handlePromotionUsers: [],
  handleCustomerUsers: [],
  handleWarehouseUsers: [],
  telesaleUsers: [],
  telesaleUserOptions: [],
  telesaleOnlineUsers: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const userSlice = createSlice({
  name: "users",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    fetchAllUserRes: (
      state: UserState,
      action: { payload: { users: TUser[]; isSyncRole?: boolean } },
    ) => {
      const { users, isSyncRole = false }: { users: TUser[]; isSyncRole?: boolean } =
        action.payload || {};

      const cloneUsers = users.filter((item) => !item.is_superuser);
      state.isSyncRole = isSyncRole;

      const {
        activeUsers,
        userOptions,
        handleLeadUsers,
        handleOrderUsers,
        handlePromotionUsers,
        handleCustomerUsers,
        handleWarehouseUsers,
        telesaleOnlineUsers,
        telesaleUsers,
        telesaleUserOptions,
      } = attachUsers(cloneUsers);

      state.users = cloneUsers;
      state.activeUsers = activeUsers;
      state.userOptions = userOptions;
      state.handleLeadUsers = handleLeadUsers;
      state.handleOrderUsers = handleOrderUsers;
      state.handlePromotionUsers = handlePromotionUsers;
      state.handleCustomerUsers = handleCustomerUsers;
      state.handleWarehouseUsers = handleWarehouseUsers;
      state.telesaleUsers = telesaleUsers;
      state.telesaleUserOptions = telesaleUserOptions;
      state.telesaleOnlineUsers = telesaleOnlineUsers;

      state.message = "";
      state.loading = false;
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    },
    createUserResponse: (state: UserState, action: { payload: { data: TUser | null } }) => {
      if (action.payload.data) {
        const newUser: TUser = action.payload.data;

        const {
          activeUsers,
          userOptions,
          handleLeadUsers,
          handleOrderUsers,
          telesaleOnlineUsers,
          telesaleUsers,
          telesaleUserOptions,
          handlePromotionUsers,
          handleCustomerUsers,
          handleWarehouseUsers,
        } = attachUsers([...state.users, newUser]);

        state.activeUsers = [...activeUsers, ...state.activeUsers];
        state.userOptions = [...userOptions, ...state.userOptions];
        state.handleLeadUsers = [...handleLeadUsers, ...state.handleLeadUsers];
        state.handleOrderUsers = [...handleOrderUsers, ...state.handleOrderUsers];
        state.handlePromotionUsers = [...handlePromotionUsers, ...state.handlePromotionUsers];
        state.handleCustomerUsers = [...handleCustomerUsers, ...state.handleCustomerUsers];
        state.handleWarehouseUsers = [...handleWarehouseUsers, ...state.handleWarehouseUsers];
        state.telesaleUsers = [...telesaleUsers, ...state.telesaleUsers];
        state.telesaleUserOptions = [...telesaleUserOptions, ...state.telesaleUserOptions];
        state.telesaleOnlineUsers = [...telesaleOnlineUsers, ...state.telesaleOnlineUsers];

        state.users = [newUser, ...state.users];
        state.isSuccessAction = "success";
      } else {
        state.isSuccessAction = "failed";
      }
    },
    updateUserResponse: (state: UserState, action: { payload: { data: TUser | null } }) => {
      if (action.payload.data) {
        const userRes = action.payload.data;

        const userId = userRes.id;

        const idxUser = state.users.findIndex((item) => item.id === userId);
        if (idxUser >= 0) {
          state.users[idxUser] = {
            ...state.users[idxUser],
            ...userRes,
          };
          const {
            activeUsers,
            userOptions,
            handleLeadUsers,
            handleOrderUsers,
            telesaleOnlineUsers,
            telesaleUsers,
            telesaleUserOptions,
            handlePromotionUsers,
            handleCustomerUsers,
            handleWarehouseUsers,
          } = attachUsers(state.users);
          state.activeUsers = activeUsers;
          state.userOptions = userOptions;
          state.handleLeadUsers = handleLeadUsers;
          state.handleOrderUsers = handleOrderUsers;
          state.handlePromotionUsers = handlePromotionUsers;
          state.handleCustomerUsers = handleCustomerUsers;
          state.handleWarehouseUsers = handleWarehouseUsers;
          state.telesaleOnlineUsers = telesaleOnlineUsers;
          state.telesaleUsers = telesaleUsers;
          state.telesaleUserOptions = telesaleUserOptions;
        }
        state.isSuccessAction = "success";
      } else {
        state.isSuccessAction = "failed";
      }
    },
    deleteUserResponse: (
      state: UserState,
      action: { payload: { id: string | null; message?: string } },
    ) => {
      const { id } = action.payload;
      if (id) {
        state.users = filter(state.users, (user) => id !== user.id);
        const {
          activeUsers,
          userOptions,
          handleLeadUsers,
          handleOrderUsers,
          telesaleOnlineUsers,
          telesaleUsers,
          telesaleUserOptions,
          handlePromotionUsers,
          handleCustomerUsers,
          handleWarehouseUsers,
        } = attachUsers(state.users);

        state.activeUsers = activeUsers;
        state.userOptions = userOptions;
        state.handleLeadUsers = handleLeadUsers;
        state.handleOrderUsers = handleOrderUsers;
        state.handlePromotionUsers = handlePromotionUsers;
        state.handleCustomerUsers = handleCustomerUsers;
        state.handleWarehouseUsers = handleWarehouseUsers;
        state.telesaleOnlineUsers = telesaleOnlineUsers;
        state.telesaleUsers = telesaleUsers;
        state.telesaleUserOptions = telesaleUserOptions;

        state.isSuccessAction = "success";
      } else {
        state.isSuccessAction = "failed";
      }
    },
    resetToast: (state: UserState) => {
      state.message = "";
      state.isSuccessAction = undefined;
    },
    setShowWelcomePopup: (state: UserState, action: any) => {
      state.isShowWelcome = action.payload;
    },
    reset: (state: UserState) => {
      state.loading = false;
      state.users = [];
      state.activeUsers = [];
      state.userOptions = [];
      state.handleLeadUsers = [];
      state.handleOrderUsers = [];
      state.handlePromotionUsers = [];
      state.handleCustomerUsers = [];
      state.handleWarehouseUsers = [];
      state.telesaleUsers = [];
      state.telesaleUserOptions = [];
      state.telesaleOnlineUsers = [];
      state.isSuccessAction = undefined;
      state.message = "";
      state.isShowWelcome = false;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUser.pending, (state:UserState) => {
  //       state.loading = true;
  //     })
  //     .addCase(fetchUser.fulfilled, (state:UserState, action:any) => {
  //       state.loading = false;
  //       state.users = action.payload;
  //     });
  // },
});

export default userSlice.reducer;

const attachUsers = (users: TUser[]) => {
  let activeUsers: TUser[] = [],
    handleLeadUsers: TUser[] = [],
    userOptions: TSelectOption[] = [],
    handleOrderUsers: TUser[] = [],
    handlePromotionUsers: TUser[] = [],
    handleCustomerUsers: TUser[] = [],
    handleWarehouseUsers: TUser[] = [],
    telesaleUsers: TUser[] = [],
    telesaleUserOptions: TSelectOption[] = [],
    telesaleOnlineUsers: TUser[] = [];

  forOf(users, (item) => {
    //active users
    if (item.is_active) {
      activeUsers = [...activeUsers, item];
      userOptions = [...userOptions, { label: item.name, value: item.id }];

      // sale users
      telesaleUsers = [...telesaleUsers, item];
      telesaleUserOptions = [...telesaleUserOptions, { label: item.name, value: item.id }];
      //sale is online users
      if (item.is_online) {
        telesaleOnlineUsers = [...telesaleOnlineUsers, item];
      }

      handleLeadUsers = [...handleLeadUsers, item];

      // có quyền xử lý đơn
      const isConfirmOrder = checkPermission(
        item.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.HANDLE],
        item,
      ).isMatch;
      if (isConfirmOrder) {
        handleOrderUsers = [...handleOrderUsers, item];
      }

      // có quyền xử lý khách hàng
      const isHandleCustomer = checkPermission(
        item.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.HANDLE],
        item,
      ).isMatch;
      if (isHandleCustomer) {
        handleCustomerUsers = [...handleCustomerUsers, item];
      }

      // có quyền xử lý kho
      const isHandleWarehouse = checkPermission(
        item.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE],
        item,
      ).isMatch;
      if (isHandleWarehouse) {
        handleWarehouseUsers = [...handleWarehouseUsers, item];
      }
    }
  });
  return {
    activeUsers,
    handleLeadUsers,
    handleOrderUsers,
    handleCustomerUsers,
    handlePromotionUsers,
    handleWarehouseUsers,
    userOptions,
    telesaleUsers,
    telesaleOnlineUsers,
    telesaleUserOptions,
  };
};

export const {
  createUserResponse,
  deleteUserResponse,
  fetchAllUserRes,
  reset,
  resetToast,
  setShowWelcomePopup,
  updateUserResponse,
} = userSlice.actions;
