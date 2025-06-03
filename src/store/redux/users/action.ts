import { userApi } from "apis/user";
import { store } from "store";
import { TUser } from "types/User";
import {
  createUserResponse,
  deleteUserResponse,
  fetchAllUserRes,
  updateUserResponse,
} from "./slice";
import { TParams } from "types/Param";

export const fetchUser = async (params?: Partial<TParams>) => {
  const { limit = 500 } = params || {};
  const { dispatch } = store;

  const result = await userApi.get<TUser>({
    params: { ...params, limit },
  });
  if (result.data) {
    dispatch(fetchAllUserRes({ users: result.data.results }));
  }
};

export const createUser = async (payload: Partial<TUser>) => {
  const { dispatch } = store;

  const result = await userApi.create({ payload });

  if (result.data) {
    dispatch(createUserResponse({ data: result.data }));
    return result.data;
  }
  return;
};

export const updateUser = async (payload: Partial<TUser>) => {
  const { dispatch } = store;

  const result = await userApi.update({ payload, endpoint: `${payload.id}/` });
  if (result?.data) {
    dispatch(updateUserResponse({ data: result.data }));
    return result.data;
  }
  return;
};

export const deleteUser = async (id: string) => {
  const { dispatch } = store;
  const result = await userApi.remove(`${id}/`);
  if (result?.data) {
    dispatch(deleteUserResponse({ id }));
    return true;
  } else {
    dispatch(deleteUserResponse({ id: null }));
    return false;
  }
};
