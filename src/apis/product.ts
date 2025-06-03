import { APIConfig, getAuthorizationHeaderFormData } from "apis";
import { ResponseType } from "axios";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { TImage } from "types/Media";
import { TParams } from "types/Param";
import { TProduct } from "types/Product";
import { TBaseResponse, TMultiResponse, VALIDATION_ERROR } from "types/ResponseApi";
import { convertCancelToken, formatParamsUtil } from "utils/param";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";
const keyFilter = [
  "category",
  "supplier",
  "variant_id",
  "reason",
  "sheet_type",
  "id",
  "created_by",
];

export const getById = async <T = TProduct>({
  params,
  endpoint,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const url = `/products/${endpoint}`;
    const result = await APIConfig(baseUrl).get<T>(url, {
      params,
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      message: RESPONSE_MESSAGES.ERROR,
      data: null,
    };
  }
};

export const get = async <T>({
  params,
  endpoint = "",
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const paramUrl = formatParamsUtil(keyFilter, params);

    const result = await APIConfig(baseUrl).get<TMultiResponse<T>>(`/products/${endpoint}`, {
      params: paramUrl,
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

export const create = async <T = TProduct>({
  params,
  endpoint = "",
  responseType,
}: {
  params?: TParams | TParams[];
  endpoint?: string;
  responseType?: ResponseType;
}) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).post<T>(`/products/${endpoint}`, params, {
      cancelToken,
      responseType,
    });
    return result;
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export const update = async <T = TProduct>({
  params,
  endpoint,
  responseType,
}: {
  params?: TParams | TParams[];
  endpoint?: string;
  responseType?: ResponseType;
}) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const url = `/products/${endpoint}`;
    const result = await APIConfig(baseUrl).patch<T>(url, params, { cancelToken, responseType });

    return result;
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};

export const remove = async <T = TProduct>({
  params,
  endpoint,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const url = `/products/${endpoint}`;
    const result = await APIConfig(baseUrl).delete<TBaseResponse<T>>(url, {
      params,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export const upload = async ({ params, endpoint }: { params: Blob; endpoint?: string }) => {
  try {
    const formData = new FormData();
    formData.append("image", params);

    const headers = getAuthorizationHeaderFormData();

    const url = `/products/${endpoint}`;
    const result = await APIConfig(baseUrl).post<TImage>(url, formData, { headers });

    return result;
  } catch (error) {
    return null;
  }
};

export const productApi = {
  update,
  remove,
  get,
  create,
  getById,
  upload,
};
