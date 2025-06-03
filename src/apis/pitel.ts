import { APIConfig } from "apis";
import { TBaseResponse, TMultiResponse } from "types/ResponseApi";
import { PITEL_TOKEN_KEY, getStorage } from "utils/asyncStorage";

const version = "v3";
const baseUrl = import.meta.env.REACT_APP_PITEL_API + `/${version}`;

export const getId = async <T>({ params, endpoint = "" }: { params?: any; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).get<TBaseResponse<T>>(`/${endpoint}`, {
      params,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const get = async <T>({
  params,
  endpoint = "",
}: {
  params?: any;
  endpoint?: string;
}): Promise<TMultiResponse<T>> => {
  try {
    const pitelToken = getStorage(PITEL_TOKEN_KEY);

    const paramsUrl = new URLSearchParams(params);
    const res = await fetch(`${baseUrl}/${endpoint}?${paramsUrl}`, {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${pitelToken}` }),
    });
    return res.json();
  } catch (error: any) {
    return {
      data: undefined,
      results: [],
      error,
    };
  }
};

export const create = async <T>({
  data,
  endpoint = "",
}: {
  data?: any;
  endpoint?: string;
}): Promise<TBaseResponse<T | null>> => {
  const pitelToken = getStorage(PITEL_TOKEN_KEY);

  try {
    const result = await fetch(`${baseUrl}/${endpoint}`, {
      body: data,
      method: "POST",
      headers: new Headers({ Authorization: `Bearer ${pitelToken}` }),
    });
    return result.json();
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const update = async <T>({ data, endpoint = "" }: { data?: any; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/${endpoint}`, data);
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const remove = async <T>(endpoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<TBaseResponse<T>>(`/${endpoint}`);
    return { data: result.status };
  } catch (error) {
    return { data: null };
  }
};

export const pitelApi = {
  get,
  getId,
  create,
  update,
  remove,
};
