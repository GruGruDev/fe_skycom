import { APIConfig } from "apis";
import { AxiosRequestConfig } from "axios";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { showError, showSuccess } from "utils/toast";

export const keyFilter = [];

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

const create = async <T>({
  payload,
  endpoint = "",
  config,
}: {
  payload: unknown;
  endpoint?: string;
  config?: AxiosRequestConfig<any>;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/upload/${endpoint}`, payload, config);
    !(result.status === 206) && showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
    return {
      data: result.data,
      status: result.status,
      message: RESPONSE_MESSAGES.CREATE_SUCCESS,
      response: result.request.response,
    };
  } catch (error: any) {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return { data: error?.response, status: error?.response?.status };
  }
};

export const uploadApi = {
  create,
};
