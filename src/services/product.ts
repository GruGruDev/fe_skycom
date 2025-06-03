import { productApi } from "apis/product";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import reduce from "lodash/reduce";
import { TParams } from "types/Param";
import { VariantDTO, TProductMaterial } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { showError, showSuccess } from "utils/toast";

const handleAddVariant = async (variant: Partial<VariantDTO>) => {
  const { sale_price = 0, neo_price = 0, is_active } = variant;
  const images = reduce(
    variant.images,
    (prev: string[], cur) => {
      return [...prev, cur?.id || ""];
    },
    [],
  );

  const params = {
    ...variant,
    images,
    sale_price: +sale_price,
    neo_price: +neo_price,
    is_active,
  };

  const result = await productApi.create<VariantDTO>({ params, endpoint: `variants/` });

  if (result?.data) {
    showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
    return result.data;
  } else {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return undefined;
  }
};

const handleUpdateVariant = async (form: Partial<VariantDTO>) => {
  const images = reduce(
    form.images,
    (prev: string[], cur) => {
      return [...prev, cur?.id || ""];
    },
    [],
  );
  const params = { ...form, images };

  const result = await productApi.update<VariantDTO>({
    params,
    endpoint: `variants/${form.id}/`,
  });

  if (result?.data) {
    showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
    return result.data;
  } else {
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    return undefined;
  }
};
// MATERIAL
const getListMaterial = async (params: TParams) => {
  const result = await productApi.get<TProductMaterial>({ params, endpoint: "materials/" });

  if (result?.data) {
    return result.data;
  }
  if (result.error.name === CANCEL_REQUEST) {
    return null;
  }
  return null;
};

const handleAddMaterial = async (form: Partial<TProductMaterial>) => {
  const { sale_price = 0, neo_price = 0, is_active } = form;
  const images = reduce(
    form.images,
    (prev: string[], cur) => {
      return [...prev, cur?.id || ""];
    },
    [],
  );

  const params = {
    ...form,
    images,
    sale_price: +sale_price,
    neo_price: +neo_price,
    is_active,
  };

  const result = await productApi.create<TProductMaterial>({ params, endpoint: `materials/` });

  if (result?.data) {
    showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
    return result.data;
  } else {
    showError(RESPONSE_MESSAGES.CREATE_ERROR);
    return undefined;
  }
};

const handleUpdateMaterial = async (form: Partial<TProductMaterial>) => {
  const images = reduce(
    form.images,
    (prev: string[], cur) => {
      return [...prev, cur?.id || ""];
    },
    [],
  );
  const params = { ...form, images };

  const result = await productApi.update<TProductMaterial>({
    params,
    endpoint: `materials/${form.id}/`,
  });

  if (result?.data) {
    showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
    return result.data;
  } else {
    showError(RESPONSE_MESSAGES.UPDATE_ERROR);
    return undefined;
  }
};

const handleDeleteMaterial = async (id?: string) => {
  const result = await productApi.remove<TProductMaterial>({
    endpoint: `materials/${id}/`,
  });

  if (result?.status === 204) {
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
    return true;
  } else {
    showError(RESPONSE_MESSAGES.DELETE_ERROR);
    return false;
  }
};

export const productServices = {
  handleAddVariant,
  handleUpdateVariant,
  //
  getListMaterial,
  handleAddMaterial,
  handleUpdateMaterial,
  handleDeleteMaterial,
};
