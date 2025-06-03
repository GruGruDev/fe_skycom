import { createSlice } from "@reduxjs/toolkit";
import { TAttribute } from "types/Attribute";
import {
  STATUS_PRODUCT_LABEL,
  TProductAttribute,
  TSupplierAttribute,
  TVariant,
} from "types/Product";

export interface ProductState {
  attributes: { [key in TProductAttribute]: TAttribute[] };
  variants: TVariant[];
}

const initialState: ProductState = {
  attributes: {
    category: [],
    tags: [],
    attributes: [],
    supplier: [],
  },
  variants: [],
};

export const attributesSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProductAttributeSuccess: (state, action) => {
      const { payload } = action;

      const suppliers = payload.supplier.map((item: TSupplierAttribute) => {
        return {
          ...item,
          code: item.business_code,
          is_shown: item.status === STATUS_PRODUCT_LABEL.active,
        } as TAttribute;
      });

      state.attributes = {
        ...state.attributes,
        ...payload,
        supplier: suppliers,
      };
    },
    getVariantsRes: (state, action) => {
      const { payload } = action;
      state.variants = payload;
    },
    addProductTagRes: (state, action) => {
      const { payload } = action;
      state.attributes.tags = [...state.attributes.tags, payload];
    },
    addCategoryRes: (state, action) => {
      const { payload } = action;
      const categories = [...state.attributes.category];
      state.attributes.category = [...categories, payload];
    },
    addSupplierRes: (state, action) => {
      const { payload } = action;
      const suppliers = [...state.attributes.supplier];
      state.attributes.supplier = [...suppliers, { ...payload, code: payload.business_code }];
    },
    updateSupplierRes: (state, action) => {
      const { payload } = action;

      const suppliers = [...state.attributes.supplier];
      const idx = suppliers.findIndex((item) => item.id === payload.id);
      suppliers.splice(idx, 1, {
        ...payload,
        is_shown: payload.status === STATUS_PRODUCT_LABEL.active,
      });

      suppliers.splice(idx, 1, payload);

      state.attributes.supplier = suppliers;
    },
  },
});

export default attributesSlice.reducer;

export const {
  getProductAttributeSuccess,
  addProductTagRes,
  addCategoryRes,
  addSupplierRes,
  updateSupplierRes,
  getVariantsRes,
} = attributesSlice.actions;
