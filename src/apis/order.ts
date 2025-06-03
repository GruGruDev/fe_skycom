import { APIConfig } from "apis";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { TParams } from "types/Param";
import { ErrorType, TBaseResponse, TMultiResponse, VALIDATION_ERROR } from "types/ResponseApi";
import { convertCancelToken, formatParamsUtil } from "utils/param";
import { showError, showSuccess } from "utils/toast";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";
const keyFilter: string[] = [
  "status",
  "source",
  "delivery_company",
  "created_by",
  "tags",
  "type",
  "payment_type",
  "handle_by",
  "assign_by",
  "source",
  "carrier_status",
  "scan_by",
  "scan_at_from",
  "scan_at_to",
  "user_id", // report
  "late_reason",
  "late_action",
  "wait_return_reason",
  "wait_return_action",
  "returning_reason",
  "returning_action",
  "returned_reason",
  "returned_action",
  "delivery_company_type",
  "customer_care_staff_id",
];

export const getById = async <T>({ endpoint, params }: { params?: TParams; endpoint?: string }) => {
  const { paramsNoneCancelToken } = convertCancelToken(params);
  try {
    const result = await APIConfig(baseUrl).get<T>(`/orders/${endpoint}`, {
      params: paramsNoneCancelToken,
    });
    return result;
  } catch (e: unknown) {
    const error = e as ErrorType;
    return {
      data: null,
      error,
    };
  }
};

export const get = async <T>({
  endpoint = "",
  params,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);
  const paramsUtil = formatParamsUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(baseUrl).get<TMultiResponse<T>>(`/orders/${endpoint}`, {
      params: paramsUtil,
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

export const create = async <T>({ endpoint, params }: { params?: TParams; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/orders/${endpoint}`, params);
    showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);

    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return { data: null, error };
  }
};

export const update = async <T>({ endpoint, params }: { params?: TParams; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/orders/${endpoint}`, params);
    showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
    return result;
  } catch (error: unknown) {
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    return {
      data: null,
      error,
    };
  }
};

export const remove = async <T>({ endpoint }: { endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).delete<TBaseResponse<T>>(`/orders/${endpoint}`);
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);

    return { data: result.status };
  } catch (error) {
    showError(RESPONSE_MESSAGES.DELETE_ERROR);
    return { data: null };
  }
};

const removeById = async ({ endpoint, params }: { endpoint: string; params?: TParams }) => {
  try {
    await APIConfig(baseUrl).delete<TBaseResponse<any>>(`/orders/${endpoint}`, params);
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
    return { data: "success", code: 204 };
  } catch (error) {
    showError(RESPONSE_MESSAGES.DELETE_ERROR);
    return { data: null };
  }
};

export const orderApi = {
  update,
  remove,
  get,
  create,
  getById,
  removeById,
};
