import { APIConfig } from "apis";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { TParamValue, TParams } from "types/Param";
import { TBaseResponse, TMultiResponse, VALIDATION_ERROR } from "types/ResponseApi";
import { convertCancelToken } from "utils/param";
import { showError, showSuccess } from "utils/toast";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";

export const get = async <T>({ endpoint, params }: { params?: TParamValue; endpoint: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).get<TMultiResponse<T>>(`/locations/${endpoint}`, {
      params: paramsNoneCancelToken,
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

export const getById = async <T>({
  endpoint,
  params,
}: {
  params?: TParamValue;
  endpoint: string;
}) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).get<TBaseResponse<T>>(`/locations/${endpoint}`, {
      params: paramsNoneCancelToken,
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const create = async <T>({ params, endpoint }: { params?: TParams; endpoint?: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).post<T>(
      `/locations/${endpoint}`,
      paramsNoneCancelToken,
      { cancelToken },
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const update = async <T>({ endpoint, params }: { params?: TParams; endpoint?: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const url = `/locations/${endpoint}`;
    delete paramsNoneCancelToken?.id;
    const result = await APIConfig(baseUrl).patch<T>(url, paramsNoneCancelToken, { cancelToken });

    return result;
  } catch (error: unknown) {
    return {
      message: "",
      data: null,
    };
  }
};

export const remove = async <T>({ endpoint, params }: { params?: TParams; endpoint?: string }) => {
  try {
    const url = `/locations/${endpoint}`;
    const result = await APIConfig(baseUrl).delete<TBaseResponse<T>>(url, {
      params,
    });
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
    if (result) return true;
  } catch (error) {
    showError(RESPONSE_MESSAGES.DELETE_ERROR);
    return false;
  }
};

export const addressApi = {
  get,
  getById,
  create,
  update,
  remove,
};
