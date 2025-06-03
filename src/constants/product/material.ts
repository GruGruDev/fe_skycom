import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { TColumn } from "types/DGrid";
import { PRODUCT_LABEL } from "./label";
import { TSelectOption } from "types/SelectOption";

// Material
export const MATERIAL_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.general_info, name: "general_info" }, //name, SKU_code, bar_code
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.price_info, name: "price_info" }, //neo_price, sale_price
  { title: PRODUCT_LABEL.shape_info, name: "shape_info" }, //neo_price, sale_price
  { title: PRODUCT_LABEL.created_info, name: "created_info", type: "user" }, // created_by, created
  { title: PRODUCT_LABEL.modified_info, name: "modified_info", type: "datetime" }, //modified_by, modified
  { title: PRODUCT_LABEL.material_note, name: "note" },
  { title: PRODUCT_LABEL.tags, name: "tags" },
];

export const MATERIAL_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 350, columnName: "general_info" }, //name, SKU_code, bar_code
  { width: 150, columnName: "is_active" },
  { width: 180, columnName: "price_info" }, //neo_price, sale_price
  { width: 180, columnName: "shape_info" }, //neo_price, sale_price
  { width: 200, columnName: "created_info" }, // created_be, create
  { width: 200, columnName: "modified_info" }, //modified_by, modified
  { width: 200, columnName: "note" },
  { width: 200, columnName: "tags" },
];

export const MATERIAL_SIMPLE_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.images, name: "images", type: "image", options: { onlyOne: true } },
  { title: PRODUCT_LABEL.name, name: "name" },
  { title: PRODUCT_LABEL.SKU_code, name: "SKU_code" },
  // { title: PRODUCT_LABEL.bar_code, name: "bar_code" },
  // { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  // { title: PRODUCT_LABEL.width, name: "width", type: "float" },
  // { title: PRODUCT_LABEL.height, name: "height", type: "float" },
  { title: PRODUCT_LABEL.weight, name: "weight", type: "float" },
  { title: PRODUCT_LABEL.total_inventory, name: "total_inventory", type: "float" },
  { title: PRODUCT_LABEL.variants, name: "variants" },
  { title: PRODUCT_LABEL.material_note, name: "note" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.created_by, name: "created_by", type: "user" },
  { title: PRODUCT_LABEL.modified, name: "modified", type: "datetime" },
  { title: PRODUCT_LABEL.modified_by, name: "modified_by", type: "user" },
];

export const MATERIAL_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 80, columnName: "images" },
  { width: 180, columnName: "name" },
  { width: 100, columnName: "SKU_code" },
  // { width: 120, columnName: "bar_code" },
  // { width: 120, columnName: "is_active" },
  // { width: 90, columnName: "width" },
  // { width: 90, columnName: "height" },
  { width: 100, columnName: "weight" },
  { width: 100, columnName: "total_inventory" },
  { width: 150, columnName: "variants" },
  { width: 120, columnName: "note" },
  { width: 120, columnName: "created" },
  { width: 120, columnName: "created_by" },
  { width: 120, columnName: "modified" },
  { width: 120, columnName: "modified_by" },
];

export const MATERIAL_SORT_OPTIONS: TSelectOption[] = [
  { label: PRODUCT_LABEL.width, value: "width" },
  { label: PRODUCT_LABEL.height, value: "height" },
  { label: PRODUCT_LABEL.weight, value: "weight" },
  { label: PRODUCT_LABEL.total_inventory, value: "total_inventory" },
  { label: PRODUCT_LABEL.created, value: "created" },
  { label: PRODUCT_LABEL.modified, value: "modified" },
];
