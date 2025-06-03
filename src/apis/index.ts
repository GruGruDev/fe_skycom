import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ERROR_STATUS } from "constants/httpStatusCode";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import {
  TCancelRequest,
  TNetwordError,
  CServerError,
  CValidationError,
  ErrorType,
} from "types/ResponseApi";
import { deleteAllStorages, getStorage } from "utils/asyncStorage";
import { handleResponseErrorMessage } from "utils/handleError";
import { showError, showWarning } from "utils/toast";

let service: AxiosInstance;
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: ErrorType) => void;
}[] = [];

const processQueue = (error: ErrorType, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// API Config
export const APIConfigNoToken = (baseUrl?: string) => {
  service = axios.create({
    baseURL: baseUrl ? baseUrl : import.meta.env.REACT_APP_API_URL + "/api",
    responseType: "json",
  });
  service.interceptors.response.use(handleSuccess, handleError);
  return service;
};

export const getAuthorizationHeaderFormData = () => {
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
    // Accept: "text/plain, */*",
    "Content-": "multipart/form-data",
  };
  return headers;
};

export const APIConfig = (baseUrl?: string, config?: AxiosRequestConfig | undefined) => {
  service = axios.create({
    baseURL: baseUrl ? baseUrl : import.meta.env.REACT_APP_API_URL + "/api",
    responseType: "json",
    ...config,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
      // Accept: "text/plain, */*",
      ...config?.headers,
    },
  });
  service.interceptors.response.use(handleSuccess, handleError);
  return service;
};

function awaitSaveStorage({ access }: { access: string }) {
  return new Promise((resolve) => {
    sessionStorage.setItem("access-token", access);
    setTimeout(() => {
      resolve("Saved storage");
    }, 100);
  });
}

const refreshToken = (err: ErrorType) => {
  const originalRequest = err.config;
  if (isRefreshing) {
    return new Promise(function (resolve, reject) {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return axios(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  return new Promise(function (resolve, reject) {
    const refreshToken = getStorage("refresh-token");
    if (refreshToken) {
      isRefreshing = true;
      const newService = axios.create({
        baseURL: import.meta.env.REACT_APP_API_URL,
        responseType: "json",
      });
      return newService
        .post("/api/token/refresh/", {
          refresh: refreshToken,
          client: "react-app",
        })
        .then(async ({ data }) => {
          const { access } = data;

          await awaitSaveStorage({ access });

          service.defaults.headers["Authorization"] = `Bearer ${access}`;
          originalRequest.headers["Authorization"] = "Bearer " + access;
          processQueue(null, access);
          resolve(axios(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          if (document.location.pathname !== "/login") {
            resetStore();
          }
          reject(err);
        })
        .then(() => {
          isRefreshing = false;
        });
    } else {
      if (err.config.url === "/users/token/") {
        showError(VALIDATION_MESSAGE.CHECK_INFO_PLEASE);
      }
      reject(err);
      return;
    }
  });
};

const resetStore = () => {
  showWarning(RESPONSE_MESSAGES.END_SESSION);
  deleteAllStorages();
  sessionStorage.clear();
  redirectTo(document, "/login");
};

const handleError = (error: ErrorType) => {
  if (!error) {
    return Promise.reject(new TCancelRequest(error));
  } else if (error.message === "Network Error") {
    showError(RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER);
    return Promise.reject(new CServerError(RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER));
  } else if (!error?.response) {
    if (axios.isCancel(error)) {
      return Promise.reject(new TCancelRequest(error.toString()));
    }
    return Promise.reject(new TNetwordError(error));
  }

  const { status } = error.response;
  switch (status) {
    case ERROR_STATUS.UNAUTHORIZED: {
      //  1. Logout user if token refresh didn't work or user is disabled
      if (error.config.url === "/users/refresh/") {
        return resetStore();
      }
      // 2. Try request again with new token
      return refreshToken(error);
    }
    case ERROR_STATUS.TOO_MANY_REQUESTS: {
      showWarning(RESPONSE_MESSAGES.MULTI_REQUEST);
      return Promise.reject(new CValidationError(RESPONSE_MESSAGES.MULTI_REQUEST));
    }
    case ERROR_STATUS.INTERNAL_SERVER_ERROR:
    case ERROR_STATUS.BAD_GATEWAY:
    case ERROR_STATUS.SERVICE_UNAVAILABLE:
    case ERROR_STATUS.GATEWAY_TIMEOUT: {
      showError(RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER);
      return Promise.reject(new CServerError(RESPONSE_MESSAGES.ERROR_CONNECTION_SERVER));
    }
    default: {
      const errorMessage = handleResponseErrorMessage(error?.response?.data);
      showError(errorMessage);

      return Promise.reject(error);
    }
  }
};

const handleSuccess = (response: any) => {
  const method = response?.config?.method;
  switch (method) {
    case "post":
      break;
    case "put":
    case "patch":
      break;
    case "delete":
      break;
    default:
      break;
  }
  return response;
};

const redirectTo = (document: any, path: string) => {
  document.location.href = path;
};
