import { APIConfig, getAuthorizationHeaderFormData } from "apis";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { TImage } from "types/Media";
import { TParams } from "types/Param";
import { TBaseResponse, TMultiResponse, VALIDATION_ERROR } from "types/ResponseApi";
import { TWarehouse } from "types/Warehouse";
import { convertCancelToken, formatParamsUtil } from "utils/param";
import { showError, showSuccess } from "utils/toast";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";
const keyFilter: string[] = [
  "created_by",
  "confirm_by",
  "change_reason",
  "warehouse",
  "category_id",
  "warehouse_id",
  "product_variant_batch",
  "warehouse_from",
  "warehouse_to",
  "variant",
  "type",
  "batch",
];

export const getById = async <T>({ params, endpoint }: { params?: TParams; endpoint?: string }) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const url = `/warehouses/${endpoint}`;
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

    const result = await APIConfig(baseUrl).get<TMultiResponse<T>>(`/warehouses/${endpoint}`, {
      params: paramUrl,
      cancelToken,
    });
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    return { data: null, error: { name: VALIDATION_ERROR } };
  }
};

export const create = async <T = TWarehouse>({
  params,
  endpoint = "",
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).post<T>(`/warehouses/${endpoint}`, params, {
      cancelToken,
    });
    showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return {
      data: null,
      error,
    };
  }
};

export const update = async <T = TWarehouse>({
  params,
  endpoint,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const { cancelToken } = convertCancelToken(params);

    const url = `/warehouses/${endpoint}`;
    const result = await APIConfig(baseUrl).patch<T>(url, params, { cancelToken });
    showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    return {
      data: null,
      error,
    };
  }
};

export const remove = async ({ params, endpoint }: { params?: TParams; endpoint?: string }) => {
  try {
    const url = `/warehouses/${endpoint}`;
    const result = await APIConfig(baseUrl).delete<TBaseResponse<TWarehouse>>(url, {
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

    const url = `/warehouses/${endpoint}`;
    const result = await APIConfig(baseUrl).post<TImage>(url, formData, { headers });

    return result;
  } catch (error) {
    return null;
  }
};

export const warehouseApi = {
  update,
  remove,
  get,
  create,
  getById,
  upload,
};
