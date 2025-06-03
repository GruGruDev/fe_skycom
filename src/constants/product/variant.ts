import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnShowSortType, TColumn } from "types/DGrid";
import { TSelectOption } from "types/SelectOption";
import { PRODUCT_LABEL } from "./label";

//variant
export const VARIANT_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.general_info, name: "general_info" }, //name, SKU_code, bar_code
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.price_info, name: "price_info" }, //neo_price, sale_price
  { title: PRODUCT_LABEL.created_info, name: "created_info", type: "user" }, // created_by, created
  { title: PRODUCT_LABEL.modified_info, name: "modified_info", type: "datetime" }, //modified_by, modified
  { title: PRODUCT_LABEL.variant_note, name: "note" },
  { title: PRODUCT_LABEL.tags, name: "tags" },
];

export const VARIANT_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 350, columnName: "general_info" }, //name, SKU_code, bar_code
  { width: 150, columnName: "is_active" },
  { width: 180, columnName: "price_info" }, //neo_price, sale_price
  { width: 200, columnName: "created_info" }, // created_be, create
  { width: 200, columnName: "modified_info" }, //modified_by, modified
  { width: 200, columnName: "note" },
  { width: 200, columnName: "tags" },
];

export const VARIANT_SORT_COLUMNS: ColumnShowSortType[] = [
  {
    name: "price_info",
    fields: [
      { name: "neo_price", title: PRODUCT_LABEL.neo_price },
      { name: "sale_price", title: PRODUCT_LABEL.sale_price },
    ],
  },
  {
    name: "created_info",
    fields: [
      { name: "created_by", title: PRODUCT_LABEL.created_by },
      { name: "created", title: PRODUCT_LABEL.created },
    ],
  },
  {
    name: "modified_info",
    fields: [
      { name: "modified_by", title: PRODUCT_LABEL.modified_by },
      { name: "modified", title: PRODUCT_LABEL.modified },
    ],
  },
];

/** VARIANT SIMPLE */

export const VARIANT_SIMPLE_SORT_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.category, name: "category_name" },
  { title: PRODUCT_LABEL.total_inventory, name: "total_inventory", type: "number" },
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.neo_price, name: "neo_price", type: "number" },
  { title: PRODUCT_LABEL.sale_price, name: "sale_price", type: "number" },
  { title: PRODUCT_LABEL.commission_value, name: "commission_value" },
  { title: PRODUCT_LABEL.total_weight, name: "total_weight", type: "float" },
  { title: PRODUCT_LABEL.variant_note, name: "note" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.modified, name: "modified", type: "datetime" },
];

export const VARIANT_SIMPLE_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.variant_sheet, name: "variant_sheet" },
  { title: PRODUCT_LABEL.images, name: "images", type: "image", options: { onlyOne: true } },
  { title: PRODUCT_LABEL.variant_name, name: "name" },
  { title: PRODUCT_LABEL.SKU_code, name: "SKU_code" },
  { title: PRODUCT_LABEL.bar_code, name: "bar_code" },
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.neo_price, name: "neo_price", type: "number" },
  { title: PRODUCT_LABEL.sale_price, name: "sale_price", type: "number" },
  { title: PRODUCT_LABEL.commission_value, name: "commission_value" },
  { title: PRODUCT_LABEL.total_inventory, name: "total_inventory", type: "number" },
  { title: PRODUCT_LABEL.total_weight, name: "total_weight", type: "float" },
  { title: PRODUCT_LABEL.variant_note, name: "note" },
  { title: PRODUCT_LABEL.category, name: "category_name" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.created_by, name: "created_by", type: "user" },
  { title: PRODUCT_LABEL.modified, name: "modified", type: "datetime" },
  { title: PRODUCT_LABEL.modified_by, name: "modified_by", type: "user" },
  { title: PRODUCT_LABEL.tags, name: "tags" },
];

export const VARIANT_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 100, columnName: "variant_sheet" },
  { width: 80, columnName: "images" },
  { width: 180, columnName: "name" },
  { width: 120, columnName: "SKU_code" },
  { width: 120, columnName: "bar_code" },
  { width: 120, columnName: "is_active" },
  { width: 100, columnName: "neo_price" },
  { width: 100, columnName: "sale_price" },
  { width: 100, columnName: "commission_value" },
  { width: 80, columnName: "total_inventory" },
  { width: 140, columnName: "total_weight" },
  { width: 120, columnName: "created" },
  { width: 120, columnName: "created_by" },
  { width: 120, columnName: "modified" },
  { width: 120, columnName: "modified_by" },
  { width: 150, columnName: "note" },
  { width: 120, columnName: "category_name" },
  { width: 120, columnName: "tags" },
];

export const VARIANT_SORT_OPTIONS: TSelectOption[] = [
  { label: PRODUCT_LABEL.sale_price, value: "sale_price" },
  { label: PRODUCT_LABEL.commission_value, value: "commission_value" },
  { label: PRODUCT_LABEL.total_inventory, value: "total_inventory" },
  { label: PRODUCT_LABEL.total_weight, value: "total_weight" },
  { label: PRODUCT_LABEL.created, value: "created" },
  { label: PRODUCT_LABEL.modified, value: "modified" },
];
