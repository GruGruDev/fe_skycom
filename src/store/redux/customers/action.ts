import { customerApi } from "apis/customer";
import { store } from "store";
import { TAttribute } from "types/Attribute";
import { TParams } from "types/Param";
import {
  addCustomerTagRes,
  addGroupRes,
  addRankRes,
  removeGroupRes,
  removeRankRes,
  updateAttributesCustomer,
  updateGroupRes,
  updateRankRes,
} from "./slice";

const getAttribute = async <T>(type: string): Promise<T[]> => {
  const res = await customerApi.get<T>({
    params: { limit: 100, page: 1 },
    endpoint: `${type}/`,
  });

  if (res.data) {
    return res.data.results;
  }

  return [];
};

export const getListCustomerAttributes = async () => {
  const [tags, groups, ranks] = await Promise.all([
    getAttribute("tags"),
    getAttribute("groups"),
    getAttribute("ranks"),
  ]);

  store.dispatch(updateAttributesCustomer({ groups, tags, ranks }));
};

export const createCustomerTag = async (payload: TAttribute) => {
  const result = await customerApi.create<TAttribute>({
    params: { name: payload.name },
    endpoint: "tags/",
  });

  if (result.data) {
    store.dispatch(addCustomerTagRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const createGroup = async (payload: TAttribute) => {
  const result = await customerApi.create<TAttribute>({
    params: { name: payload.name },
    endpoint: "groups/",
  });

  if (result.data) {
    store.dispatch(addGroupRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const updateGroup = async (params: TAttribute) => {
  const { name, id, index } = params;
  const { dispatch } = store;
  const result = await customerApi.update<TAttribute>({
    params: { name },
    endpoint: `groups/${id}/`,
  });
  if (result.data) {
    dispatch(updateGroupRes({ index, ...result.data }));
    return true;
  }
  return false;
};

export const removeGroup = async (payload: TAttribute) => {
  const { id } = payload;

  const result = await customerApi.removeById({
    endpoint: `groups/${id}/`,
  });

  if (result?.code === 204) {
    store.dispatch(removeGroupRes(id));
    return true;
  } else {
    return false;
  }
};

export const createRank = async (payload: TParams) => {
  const result = await customerApi.create<TParams>({
    params: payload,
    endpoint: "ranks/",
  });

  if (result.data) {
    store.dispatch(addRankRes(result.data.data));
    return true;
  } else {
    return false;
  }
};

export const updateRank = async (params: TParams) => {
  const { id, index } = params;
  const { dispatch } = store;
  const result = await customerApi.update<TParams>({
    params,
    endpoint: `ranks/${id}/`,
  });
  if (result.data) {
    dispatch(updateRankRes({ index, ...(result.data.data as TParams) }));
    return true;
  }
  return false;
};

export const removeRank = async (payload: TAttribute) => {
  const { id } = payload;

  const result = await customerApi.removeById({
    endpoint: `ranks/${id}/`,
  });

  if (result?.code === 204) {
    store.dispatch(removeRankRes(id));
    return true;
  } else {
    return false;
  }
};
