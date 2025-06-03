import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ORDER_LABEL } from "constants/order/label";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { TColumn } from "types/DGrid";
import { PRODUCT_LABEL } from "./label";

// product

export const PRODUCT_COLUMNS: TColumn[] = [
  { title: PRODUCT_LABEL.add_variant, name: "add_variant" },
  { title: PRODUCT_LABEL.name, name: "product_name" },
  { title: PRODUCT_LABEL.is_active, name: "is_active", type: "boolean" },
  { title: PRODUCT_LABEL.SKU_code, name: "SKU_code" },
  { title: PRODUCT_LABEL.total_variants, name: "total_variants", type: "number" },
  { title: PRODUCT_LABEL.total_inventory, name: "total_inventory", type: "number" },
  { title: PRODUCT_LABEL.category, name: "category" },
  { title: PRODUCT_LABEL.supplier, name: "supplier" },
  { title: PRODUCT_LABEL.product_note, name: "note" },
  { title: PRODUCT_LABEL.created, name: "created", type: "datetime" },
  { title: PRODUCT_LABEL.created_by, name: "created_by", type: "user" },
];

export const PRODUCT_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "add_variant", width: 100 },
  { columnName: "product_name", width: 200 },
  { columnName: "is_active", width: 120 },
  { columnName: "SKU_code", width: 120 },
  { columnName: "total_variants", width: 110 },
  { columnName: "total_inventory", width: 110 },
  { columnName: "category", width: 150 },
  { columnName: "supplier", width: 150 },
  { columnName: "note", width: 150 },
  { columnName: "created", width: 120 },
  { columnName: "created_by", width: 140 },
];

// detail

export const PRODUCT_ORDERS_COLUMNS: TColumn[] = [
  { title: ORDER_LABEL.order, name: "name" },
  { title: ORDER_LABEL.status, name: "status" },
  { title: ORDER_LABEL.order_key, name: "order" },
  { title: ORDER_LABEL.fee, name: "fee" },
  { title: ORDER_LABEL.delivery_info, name: "delivery" },
];

export const PRODUCT_ORDERS_COLUMNS_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 120 },
  { columnName: "status", width: 120 },
  { columnName: "order", width: 120 },
  { columnName: "fee", width: 120 },
  { columnName: "delivery", width: 120 },
];

export const PRODUCT_INVENTORY_COLUMNS: TColumn[] = [
  { title: INVENTORY_LOG_LABEL.warehouse, name: "warehouse", type: "attribute" },
  {
    title: INVENTORY_LOG_LABEL.product_variant_batch,
    name: "product_variant_batch",
    type: "attribute",
  },
  { title: INVENTORY_LOG_LABEL.inventory, name: "quantity", type: "float" },
];

export const PRODUCT_INVENTORY_COLUMNS_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "warehouse", width: 120 },
  { columnName: "product_variant_batch", width: 150 },
  { columnName: "quantity", width: 80 },
];

export const VARIANT_INVENTORY_COLUMNS: TColumn[] = [
  { title: INVENTORY_LOG_LABEL.batch_name, name: "batch_name" },
  {
    title: INVENTORY_LOG_LABEL.total_inventory,
    name: "total_inventory",
    type: "number",
  },
];

export const VARIANT_INVENTORY_COLUMNS_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "batch_name", width: 120 },
  { columnName: "total_inventory", width: 150 },
];

export const BATCH_INVENTORY_COLUMNS: TColumn[] = [
  { name: "warehouse_name", title: INVENTORY_LOG_LABEL.warehouse_name },
  {
    name: "inventory",
    title: INVENTORY_LOG_LABEL.inventory,
    type: "number",
  },
];

export const BATCH_INVENTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "warehouse_name", width: 180 },
  { columnName: "inventory", width: 120 },
];
