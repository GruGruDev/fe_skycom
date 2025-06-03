import { APIConfig } from "apis";
import { ERROR_STATUS } from "constants/httpStatusCode";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { showError } from "utils/toast";
import { TUser } from "types/User";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { ErrorType } from "types/ResponseApi";

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

const login = async (loginForm: { password: string; email: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<{
      access: string;
      refresh: string;
    }>("/token/", loginForm);
    return result;
  } catch (error: unknown) {
    const e = error as ErrorType;
    if (e?.response?.status === ERROR_STATUS.UNAUTHORIZED) {
      showError(VALIDATION_MESSAGE.UNAUTHORIZED_LOGIN);
    }
    throw new Error(error as string);
  }
};

const getProfile = async () => {
  try {
    const result = await APIConfig(baseUrl).get<Partial<TUser>>("/users/me/");
    return {
      data: result.data,
      message: result.statusText,
    };
  } catch (error) {
    return {
      message: RESPONSE_MESSAGES.NOT_FOUND,
      data: null,
    };
  }
};

const refreshToken = async ({ refresh }: { refresh: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<{
      access: string;
      refresh: string;
    }>("/token/refresh/", { refresh });
    return result;
  } catch (error: ErrorType) {
    throw new Error(error as string);
  }
};

export const authApi = {
  login,
  getProfile,
  refreshToken,
};
