import { APIConfig } from "apis";
import { TImage, TImageDTO } from "types/Media";
import { TParams } from "types/Param";

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

export const uploadImage = async ({
  endpoint = "",
  params,
}: {
  endpoint?: string;
  params: TImageDTO;
}) => {
  try {
    const formData = new FormData();
    formData.append("image", params.image);

    if (params.type) formData.append("type", params.type);

    if (params.user) formData.append("user", params.user);
    if (params.product) formData.append("product", params.product);
    if (params.product_variant) formData.append("product_variant", params.product_variant);
    if (params.material) formData.append("material", params.material);
    if (params.payment) formData.append("payment", params.payment);

    const result = await APIConfig(baseUrl).post<TImage>(`/files/${endpoint}`, formData);

    return result;
  } catch (error) {
    return;
  }
};

export const update = async ({
  endpoint = "",
  params,
}: {
  endpoint?: string;
  params: Partial<TImageDTO>;
}) => {
  try {
    const formData = new FormData();
    if (params.type) formData.append("type", params.type);

    if (params.user) formData.append("user", params.user);
    if (params.product) formData.append("product", params.product);
    if (params.product_variant) formData.append("product_variant", params.product_variant);
    if (params.material) formData.append("material", params.material);
    if (params.payment) formData.append("payment", params.payment);
    if (params.is_default != undefined) {
      formData.append("is_default", params.is_default.toString());
    }

    const result = await APIConfig(baseUrl).patch<TImage>(`/files/${endpoint}`, formData);

    return result.data;
  } catch (error) {
    return null;
  }
};

export const remove = async <T = TImage>({
  params,
  endpoint,
}: {
  params?: TParams;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).delete<T>(`/files/${endpoint}`, params);

    if (result) return result;
  } catch (error) {
    return null;
  }
};

export const fileApi = {
  uploadImage,
  update,
  remove,
};
