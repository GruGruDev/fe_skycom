import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { TCustomer } from "types/Customer";
import { TParams } from "types/Param";
import { TBaseResponse, TMultiResponse, VALIDATION_ERROR } from "types/ResponseApi";
import { TUser } from "types/User";
import { convertCancelToken, formatParamsUtil } from "utils/param";
import { showError, showSuccess } from "utils/toast";
import { APIConfig } from "./index";

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

export const keyFilter = ["created_by", "tags", "rank", "customer_care_staff", "groups"];

const get = async <T = TCustomer>({
  endpoint = "",
  params,
}: {
  endpoint?: string;
  params?: TParams;
}) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

  const paramsURL = formatParamsUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(baseUrl).get<TMultiResponse<T>>(`/cdp/${endpoint}`, {
      params: paramsURL,
      cancelToken,
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    return { data: null, error: { name: VALIDATION_ERROR } };
  }
};

export const getById = async <T = TCustomer>({
  params,
  endpoint,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).get<T>(`/cdp/${endpoint}`, {
      params,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const create = async <T = TCustomer>({
  params,
  endpoint,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/cdp/${endpoint}`, params);
    showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
    return result;
  } catch (error: unknown) {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return {
      data: null,
    };
  }
};

export const update = async <T = TCustomer>({
  params,
  endpoint,
}: {
  endpoint: string;
  params?: TParams;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/cdp/${endpoint}`, {
      ...params,
      id: undefined,
      index: undefined,
      type: undefined,
    });
    showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    return {
      data: null,
    };
  }
};

const removeById = async <T = TUser>({
  endpoint,
  params,
}: {
  endpoint: string;
  params?: TParams;
}) => {
  try {
    await APIConfig(baseUrl).delete<TBaseResponse<T>>(`/cdp/${endpoint}`, params);
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
    return { data: "success", code: 204 };
  } catch (error) {
    showError(RESPONSE_MESSAGES.DELETE_ERROR);
    return {
      data: null,
    };
  }
};

export const customerApi = {
  get,
  getById,
  create,
  update,
  removeById,
};
