import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "apis/user";
import { RootState, store } from "store";
import { TAttribute } from "types/Attribute";

export type SettingState = {
  departments: TAttribute[];
};

const initialState: SettingState = {
  departments: [],
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    getDepartmentSuccess: (
      state: SettingState,
      action: {
        payload: { departments: TAttribute[] };
      },
    ) => {
      state.departments = action.payload.departments;
    },
    addDepartmentRes: (state, action) => {
      const { payload } = action;

      const reasons = [...state.departments];

      state.departments = [...reasons, payload];
    },
    updateDepartmentRes: (state, action) => {
      const { payload } = action;

      const reasons = [...state.departments];
      const idx = reasons.findIndex((item) => item.id === payload.id);
      reasons.splice(idx, 1, payload);

      state.departments = reasons;
    },
    removeDepartmentRes: (state, action) => {
      const { payload } = action;

      const reasons = [...state.departments];
      const listDepartment = reasons.filter((item) => item.id !== payload);

      state.departments = listDepartment;
    },
  },
});

export const getDepartment = async () => {
  const { dispatch } = store;
  const res = await userApi.get({
    params: { limit: 100, page: 1 },
    endpoint: "department/",
  });
  if (res.data) {
    const { results = [] } = res.data;
    dispatch(getDepartmentSuccess({ departments: results }));
  }
};

export const createDepartment = async (row: TAttribute) => {
  const result = await userApi.create<TAttribute>({
    payload: { name: row.name, is_shown: true, is_receive_lead: true },
    endpoint: "department/",
  });

  if (result.data) {
    store.dispatch(addDepartmentRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const updateDepartment = async (row: TAttribute) => {
  const { name, id, is_receive_lead } = row;

  const result = await userApi.update<TAttribute>({
    payload: { name, is_receive_lead },
    endpoint: `department/${id}/`,
  });

  if (result.data) {
    store.dispatch(updateDepartmentRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const removeDepartment = async (row: TAttribute) => {
  const { id } = row;

  const result = await userApi.remove(`department/${id}/`);

  if (result?.status === 204) {
    store.dispatch(removeDepartmentRes(id));
    return true;
  } else {
    return false;
  }
};

export const settingsStore = (state: RootState) => state.settings;
export default settingsSlice.reducer;
export const { getDepartmentSuccess, addDepartmentRes, removeDepartmentRes, updateDepartmentRes } =
  settingsSlice.actions;
