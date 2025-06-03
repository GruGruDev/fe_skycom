import { APIConfig, getAuthorizationHeaderFormData } from "apis";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { TImage } from "types/Media";
import { TParams } from "types/Param";
import { showError, showSuccess } from "utils/toast";

import { TMultiResponse, VALIDATION_ERROR } from "types/ResponseApi";
import { TUser } from "types/User";
import { convertCancelToken, formatParamsUtil } from "utils/param";

const endpoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endpoint;
const keyFilter = ["group_permission", "role", "department", "user", "action_name", "action_type"];

export const upload = async ({ params, endpoint = "" }: { params: Blob; endpoint?: string }) => {
  try {
    const formData = new FormData();
    formData.append("image", params);

    const headers = getAuthorizationHeaderFormData();

    const url = `/users/${endpoint}`;
    const result = await APIConfig(baseUrl).post<TImage>(url, formData, { headers });

    showSuccess(RESPONSE_MESSAGES.UPLOAD_SUCCESS);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.UPLOAD_ERROR);
    return null;
  }
};

export const get = async <T = TUser>({
  endpoint = "",
  params,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const paramsUrl = formatParamsUtil(keyFilter, paramsNoneCancelToken);

    const result = await APIConfig(baseUrl).get<TMultiResponse<T>>(`/users/${endpoint}`, {
      params: paramsUrl,
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

export const create = async <T = TUser>({
  payload,
  endpoint = "",
  message,
}: {
  payload?: unknown;
  endpoint?: string;
  message?: string | null;
}) => {
  const successMessage =
    message === null ? "" : !message ? RESPONSE_MESSAGES.CREATE_SUCCESS : message;
  try {
    const result = await APIConfig(baseUrl).post<T>(`/users/${endpoint}`, payload);
    successMessage && showSuccess(successMessage);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return {
      data: null,
    };
  }
};

export const update = async <T = TUser>({
  payload,
  endpoint = "",
}: {
  payload?: unknown;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/users/${endpoint}`, payload);
    showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    return {
      data: null,
    };
  }
};

export const remove = async (endpoint = "") => {
  try {
    const url = `/users/${endpoint}`;
    const result = await APIConfig(baseUrl).delete<TUser>(url);
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
    return result;
  } catch (error) {
    showError(RESPONSE_MESSAGES.DELETE_ERROR);
    return null;
  }
};

export const userApi = {
  upload,
  create,
  get,
  update,
  remove,
};
