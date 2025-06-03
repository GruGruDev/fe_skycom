import { LABEL } from "constants/label";
import { showError } from "./toast";

export const handleResponseErrorMessage = (errors: any) => {
  if (Array.isArray(errors)) {
    return handleArrayError(errors);
  } else if (typeof errors === "object") {
    return handleObjectError(errors);
  }
  return LABEL.NOT_FOUND_ERROR;
};

const handleObjectError = (error: { message?: string; [key: string]: any }): string => {
  if (error.message) {
    return error.message;
  }
  const errorKey = Object.keys(error)[0];
  const firstError: object | string = error[errorKey];
  if (Array.isArray(firstError)) {
    return handleArrayError(firstError as Array<any>);
  }
  if (typeof firstError === "object") {
    return handleObjectError(firstError);
  }
  return firstError?.toString();
};

const handleArrayError = (error: Array<any>): string => {
  const firstError: object | string | number = error[0];
  if (typeof firstError === "object") {
    return handleObjectError(firstError);
  }
  return firstError?.toString();
};

export const handleNotifyErrors = (errors: { [key: string]: any }) => {
  if (Object.keys(errors).length > 0) {
    const message = handleResponseErrorMessage(errors);

    showError(message);
  }
};
