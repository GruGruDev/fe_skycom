import { DD_MM_YYYY } from "constants/time";
import dayjs from "dayjs";

export const PITEL_USER_ID_KEY = "pitel-userid";
export const PITEL_TOKEN_KEY = "pitel-token";

export const getStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const deleteStorage = (key: string) => {
  return localStorage.removeItem(key);
};

export const deleteAllStorages = () => {
  localStorage.clear();
  return localStorage.setItem("today", dayjs(new Date()).format(DD_MM_YYYY));
};

export const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, value);
};
