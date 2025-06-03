import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { TColumn } from "types/DGrid";
import { PRODUCT_LABEL } from "./label";

export const COMBO_VARIANT_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.variant_name, name: "name" },
  { title: PRODUCT_LABEL.SKU_code, name: "SKU_code" },
  { title: PRODUCT_LABEL.quantity, name: "quantity", type: "float" },
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.neo_price, name: "neo_price", type: "number" },
  { title: PRODUCT_LABEL.sale_price, name: "sale_price", type: "number" },
  { title: PRODUCT_LABEL.bar_code, name: "bar_code" },
  { title: PRODUCT_LABEL.combo_note, name: "note" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.modified, name: "modified", type: "datetime" },
  { title: PRODUCT_LABEL.created_by, name: "created_by", type: "user" },
  { title: PRODUCT_LABEL.modified_by, name: "modified_by", type: "user" },
  { title: PRODUCT_LABEL.tags, name: "tags" },
];

export const COMBO_VARIANT_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 300 },
  { columnName: "SKU_code", width: 180 },
  { columnName: "quantity", width: 120 },
  { columnName: "is_active", width: 150 },
  { columnName: "created", width: 140 },
  { columnName: "modified", width: 140 },
  { columnName: "created_by", width: 120 },
  { columnName: "modified_by", width: 150 },
  { columnName: "note", width: 150 },
  { columnName: "neo_price", width: 150 },
  { columnName: "sale_price", width: 150 },
  { columnName: "bar_code", width: 150 },
  { columnName: "tags", width: 200 },
];

export const COMBO_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.name, name: "product_name" },
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.created_by, name: "created_by", type: "user" },
  { title: PRODUCT_LABEL.category, name: "category" },
  { title: PRODUCT_LABEL.supplier, name: "supplier" },
  { title: PRODUCT_LABEL.combo_note, name: "note" },
];

export const COMBO_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "product_name", width: 300 },
  { columnName: "is_active", width: 150 },
  { columnName: "created", width: 140 },
  { columnName: "created_by", width: 140 },
  { columnName: "category", width: 150 },
  { columnName: "supplier", width: 150 },
  { columnName: "note", width: 150 },
];

export const COMBO_SIMPLE_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.name, name: "name" },
  { title: PRODUCT_LABEL.SKU_code, name: "SKU_code" },
  { title: PRODUCT_LABEL.bar_code, name: "bar_code" },
  { title: PRODUCT_LABEL.neo_price, name: "nep_price", type: "number" },
  { title: PRODUCT_LABEL.sale_price, name: "sale_price", type: "number" },
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.created_by, name: "created_by", type: "user" },
  { title: PRODUCT_LABEL.combo_note, name: "note" },
];

export const COMBO_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 250 },
  { columnName: "SKU_code", width: 180 },
  { columnName: "bar_code", width: 180 },
  { columnName: "nep_price", width: 100 },
  { columnName: "sale_price", width: 100 },
  { columnName: "is_active", width: 150 },
  { columnName: "created", width: 140 },
  { columnName: "created_by", width: 140 },
  { columnName: "note", width: 150 },
];
