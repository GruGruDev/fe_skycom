import { VariantItemColumnName } from "components/Product";
import { ALL_OPTION } from "constants/index";
import { TColumn } from "types/DGrid";
import { ECOMMERCE_PLARFORM, STATUS_PRODUCT_LABEL, TVariant } from "types/Product";
import { PRODUCT_LABEL } from "./label";
import { TSelectOption } from "types/SelectOption";

export const STATUS_PRODUCT_OPTIONS = [
  { label: PRODUCT_LABEL[STATUS_PRODUCT_LABEL.active], value: true },
  { label: PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive], value: false },
];

export const LINK_ECOMMERCE_PRODUCT = {
  [ECOMMERCE_PLARFORM.LAZADA]: "",
  [ECOMMERCE_PLARFORM.SHOPEE]: "https://shopee.vn/product/801295844/",
  [ECOMMERCE_PLARFORM.TIKTOK]:
    "https://shop.tiktok.com/view/product/1729487533140314419?region=VN&locale=vi-VN",
};

export enum INSTANCE {
  CATEGORY = "category",
  TYPE = "type",
  UNIT = "unit",
  ATTRIBUTE = "attribute",
  TAGS = "tags",
  SUPPLIER = "supplier",
  PRODUCT = "product",
  COMBO = "combo",
  IMAGE = "image",
}

export enum ACTION {
  ADD = "add",
  UPDATE = "update",
  DELETE = "delete",
}

export enum ACTION_RESPONSE {
  ADD_SUCCESS = "ADD_SUCCESS",
  ADD_FAILED = "ADD_FAILED",
  UPDATE_SUCCESS = "UPDATE_SUCCESS",
  UPDATE_FAILED = "UPDATE_FAILED",
  DELETE_SUCCESS = "DELETE_SUCCESS",
  DELETE_FAILED = "DELETE_FAILED",
}

export const PRODUCT_STATUS_OPTIONS = [
  ALL_OPTION,
  { label: PRODUCT_LABEL[STATUS_PRODUCT_LABEL.active], value: "true" },
  { label: PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive], value: "false" },
];

export const INIT_VARIANT: Partial<TVariant> = {
  sale_price: 0,
  is_active: true,
  SKU_code: "",
  name: "",
};

/**IMPORT VARIANT FILE */
export const IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS = {
  product_name: `*${PRODUCT_LABEL.name}`,
  product_SKU_code: `*${PRODUCT_LABEL.SKU_code}`,
  product_category: `*${PRODUCT_LABEL.category}`,
  name: `*${PRODUCT_LABEL.variant_name}`,
  SKU_code: `*${PRODUCT_LABEL.variant_SKU_code}`,
  neo_price: `*${PRODUCT_LABEL.neo_price}`,
  sale_price: `*${PRODUCT_LABEL.sale_price}`,
  inventory_quantity: `*${PRODUCT_LABEL.inventory_quantity}`,
  note: `*${PRODUCT_LABEL.variant_note}`,
};

const IMPORT_VARIANT_HEADER_CELL = {
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_name]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_SKU_code]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_category]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.name]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.SKU_code]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.sale_price]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.neo_price]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.inventory_quantity]: "",
  [IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.note]: "",
};
export const IMPORT_VARIANT_EXCEL_TEMPLATE = {
  defaultData: [IMPORT_VARIANT_HEADER_CELL],
  fileName: "file-mau-tao-bien-the",
};

export const IMPORT_VARIANT_COLUMNS: TColumn[] = [
  { title: "Stt", name: "rowId" },
  { title: IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_name, name: "product_name" },
  { title: IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_SKU_code, name: "product_SKU_code" },
  { title: IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.product_category, name: "product_category" },
  { title: IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.name, name: "name" },
  { title: IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS.SKU_code, name: "SKU_code" },
  { title: PRODUCT_LABEL.sale_price, name: "sale_price", type: "number" },
  { title: PRODUCT_LABEL.neo_price, name: "neo_price", type: "number" },
  { title: PRODUCT_LABEL.inventory_quantity, name: "inventory_quantity", type: "number" },
  { title: PRODUCT_LABEL.variant_note, name: "note" },
];

export const IMPORT_VARIANT_COLUMN_WIDTHS = [
  { width: 50, columnName: "rowId" },
  { width: 120, columnName: "product_name" },
  { width: 120, columnName: "product_SKU_code" },
  { width: 120, columnName: "product_category" },
  { width: 150, columnName: "name" },
  { width: 150, columnName: "SKU_code" },
  { width: 120, columnName: "neo_price" },
  { width: 120, columnName: "sale_price" },
  { width: 150, columnName: "inventory_quantity" },
  { width: 150, columnName: "note" },
];

/**IMPORT PROFILE FILE */
export const IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS = {
  NAME: `*${PRODUCT_LABEL.name}`,
  NOTE: PRODUCT_LABEL.product_note,
};

export const IMPORT_PRODUCT_COLUMNS: TColumn[] = [
  { title: "Stt", name: "rowId" },
  { title: PRODUCT_LABEL.name, name: "name" },
  { title: PRODUCT_LABEL.category, name: "category" },
  { title: PRODUCT_LABEL.supplier, name: "supplier" },
  { title: PRODUCT_LABEL.product_note, name: "note" },
];

export const IMPORT_PRODUCT_COLUMN_WIDTHS = [
  { width: 50, columnName: "rowId" },
  { width: 120, columnName: "name" },
  { width: 200, columnName: "category" },
  { width: 200, columnName: "supplier" },
  { width: 150, columnName: "note" },
];

const IMPORT_PRODUCT_HEADER_CELL = {
  [IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS.NAME]: "",
  [IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS.NOTE]: "",
};
export const IMPORT_PRODUCT_EXCEL_TEMPLATE = {
  defaultData: [IMPORT_PRODUCT_HEADER_CELL],
  fileName: "file-mau-tao-san-pham",
};

export const VARIANT_COLUMN_GRID: { [key in VariantItemColumnName]: number } = {
  name: 5,
  combo: 0,
  cross_sale: 0,
  image: 0,
  price: 2,
  product: 0,
  neo_price: 2,
  quantity: 3,
  sku: 0,
  total: 0,
};

export const PRODUCT_SORT_OPTIONS: TSelectOption[] = [
  { label: PRODUCT_LABEL.total_variants, value: "total_variants" },
  { label: PRODUCT_LABEL.total_inventory, value: "total_inventory" },
  { label: PRODUCT_LABEL.created, value: "created" },
];

/**UPDATE VARIANT FILE */
export const BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS = {
  SKU_code: `*${PRODUCT_LABEL.variant_SKU_code}`,
  neo_price: `*${PRODUCT_LABEL.neo_price}`,
  sale_price: `*${PRODUCT_LABEL.sale_price}`,
};

const BULK_UPDATE_VARIANT_HEADER_CELL = {
  [BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.SKU_code]: "",
  [BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.sale_price]: "",
  [BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.neo_price]: "",
};
export const BULK_UPDATE_VARIANT_EXCEL_TEMPLATE = {
  defaultData: [BULK_UPDATE_VARIANT_HEADER_CELL],
  fileName: "file-mau-cap-nhat-bien-the",
};

export const BULK_UPDATE_VARIANT_COLUMNS: TColumn[] = [
  { title: "Stt", name: "rowId" },
  { title: BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.SKU_code, name: "SKU_code" },
  { title: BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.sale_price, name: "sale_price", type: "number" },
  { title: BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS.neo_price, name: "neo_price", type: "number" },
];

export const BULK_UPDATE_VARIANT_COLUMN_WIDTHS = [
  { width: 50, columnName: "rowId" },
  { width: 150, columnName: "SKU_code" },
  { width: 120, columnName: "neo_price" },
  { width: 120, columnName: "sale_price" },
];
