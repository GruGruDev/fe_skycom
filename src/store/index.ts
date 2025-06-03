import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import rolesReducer from "store/redux/roles/slice";
import sidebarReducer from "store/redux/sidebar/slice";
import userReducer from "store/redux/users/slice";
import productReducer from "store/redux/products/slice";
import customerReducer from "./redux/customers/slice";
import warehousesReducer from "./redux/warehouses/slice";
import settingsReducer from "./redux/settings/slice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    roles: rolesReducer,
    sidebar: sidebarReducer,
    product: productReducer,
    customer: customerReducer,
    warehouses: warehousesReducer,
    settings: settingsReducer,
  },
});

export const { dispatch } = store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
