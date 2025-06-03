import { productApi } from "apis/product";
import { store } from "store";
import { TAttribute } from "types/Attribute";
import { STATUS_PRODUCT_LABEL, TVariant } from "types/Product";
import {
  addCategoryRes,
  addProductTagRes,
  addSupplierRes,
  getProductAttributeSuccess,
  getVariantsRes,
  updateSupplierRes,
} from "./slice";

const getAttribute = async <T>(type: string): Promise<T[]> => {
  const res = await productApi.get<T>({
    params: { limit: 100, page: 1 },
    endpoint: `${type}/`,
  });
  if (res.data) {
    return res.data.results;
  }
  return [];
};

export const getListVariant = async (params = { limit: 200, page: 1, type: "simple" }) => {
  const res = await productApi.get<TVariant>({
    endpoint: `variants/`,
    params,
  });
  if (res.data) {
    store.dispatch(getVariantsRes(res.data?.results));
  }
};

export const getProductAttributes = async () => {
  const [category, supplier, tags] = await Promise.all([
    getAttribute("category"),
    getAttribute("supplier"),
    getAttribute("tag"),
  ]);

  store.dispatch(getProductAttributeSuccess({ category, supplier, tags }));
};

export const createProductTag = async (row: TAttribute) => {
  const result = await productApi.create<TAttribute>({
    params: { tag: row.tag },
    endpoint: "tag/",
  });

  if (result.data) {
    store.dispatch(addProductTagRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const createCategory = async (row: TAttribute) => {
  const result = await productApi.create<TAttribute>({
    params: { name: row.name, code: row.code },
    endpoint: "category/",
  });

  if (result.data) {
    store.dispatch(addCategoryRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const createSupplier = async (row: TAttribute) => {
  const result = await productApi.create<TAttribute>({
    params: { name: row.name, business_code: row.code },
    endpoint: "supplier/",
  });

  if (result.data) {
    store.dispatch(addSupplierRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const updateSupplier = async (row: TAttribute) => {
  const { id, is_shown } = row;

  const result = await productApi.update<TAttribute>({
    params: { status: is_shown ? STATUS_PRODUCT_LABEL.active : STATUS_PRODUCT_LABEL.inactive },

    endpoint: `supplier/${id}/`,
  });

  if (result.data) {
    store.dispatch(updateSupplierRes({ ...row, ...result.data }));
    return true;
  } else {
    return false;
  }
};
