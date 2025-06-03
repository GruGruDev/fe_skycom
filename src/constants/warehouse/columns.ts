import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { PRODUCT_LABEL } from "constants/product/label";
import map from "lodash/map";
import { TColumn } from "types/DGrid";
import { INVENTORY_LOG_LABEL, SCAN_CODE_LABEL, SHEET_LABEL, WAREHOUSE_LABEL } from "./label";

export const WAREHOUSE_COLUMNS: TColumn[] = [
  { title: WAREHOUSE_LABEL.name, name: "name" },
  { title: WAREHOUSE_LABEL.address, name: "addresses" },
  { title: WAREHOUSE_LABEL.is_sales, name: "is_sales" },
  { title: WAREHOUSE_LABEL.manager_info, name: "manager_info" }, // manager_name, manager_phone
  { title: WAREHOUSE_LABEL.created_by, name: "created_info" }, // created_by, created
  { title: WAREHOUSE_LABEL.warehouse_note, name: "note" },
];

export const WAREHOUSE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 200 },
  { columnName: "addresses", width: 250 },
  { columnName: "is_sales", width: 150 },
  { columnName: "manager_info", width: 180 },
  { columnName: "created_info", width: 180 },
  { columnName: "note", width: 150 },
];

export const WAREHOUSE_HIDDEN_COLUMN_NAMES = [];

export const WAREHOUSE_CO = map(WAREHOUSE_COLUMN_WIDTHS, (column) => column.columnName);

/** WAREHOUSE - SIMPLE COLUMNS */

export const WAREHOUSE_SIMPLE_COLUMNS: TColumn[] = [
  { title: WAREHOUSE_LABEL.name, name: "name" },
  { title: WAREHOUSE_LABEL.address, name: "addresses" },
  { title: WAREHOUSE_LABEL.is_default, name: "is_default", type: "boolean" },
  { title: WAREHOUSE_LABEL.is_sales, name: "is_sales", type: "boolean" },
  { title: WAREHOUSE_LABEL.manager_name, name: "manager_name" },
  { title: WAREHOUSE_LABEL.manager_phone, name: "manager_phone" },
  { title: WAREHOUSE_LABEL.created, name: "created", type: "datetime" },
  { title: WAREHOUSE_LABEL.created_by, name: "created_by", type: "user" },
  { title: WAREHOUSE_LABEL.warehouse_note, name: "note" },
];

export const WAREHOUSE_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 200 },
  { columnName: "addresses", width: 250 },
  { columnName: "is_default", width: 150 },
  { columnName: "is_sales", width: 150 },
  { columnName: "manager_name", width: 180 },
  { columnName: "manager_phone", width: 180 },
  { columnName: "created", width: 180 },
  { columnName: "created_by", width: 180 },
  { columnName: "note", width: 150 },
];

export const WAREHOUSE_SIMPLE_HIDDEN_COLUMN_NAMES = [];

export const WAREHOUSE_SIMPLE_CO = map(
  WAREHOUSE_SIMPLE_COLUMN_WIDTHS,
  (column) => column.columnName,
);

// sheet

export const SHEET_COLUMNS: TColumn[] = [
  { name: "created_info", title: SHEET_LABEL.created_by }, // created, created_by
  { name: "code", title: SHEET_LABEL.code },
  // { name: "type", title: "Loại phiếu" },
  { name: "change_reason", title: SHEET_LABEL.change_reason },
  { name: "order_key", title: SHEET_LABEL.order_key },
  { name: "note", title: SHEET_LABEL.note },
  { name: "sheet_detail", title: SHEET_LABEL.sheet_details },
  { name: "warehouse", title: SHEET_LABEL.warehouse },
  { name: "warehouse_from", title: SHEET_LABEL.warehouse_from },
  { name: "warehouse_to", title: SHEET_LABEL.warehouse_to },
  { name: "modified_info", title: SHEET_LABEL.modified_info }, //modified, modified_by
  { name: "confirm_info", title: SHEET_LABEL.confirm_info }, //confirm_by, confirm_date
  { name: "status", title: SHEET_LABEL.status },
];

export const SHEET_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "created_info", width: 220 },
  { columnName: "code", width: 150 },
  { columnName: "change_reason", width: 150 },
  { columnName: "order_key", width: 120 },
  { columnName: "note", width: 150 },
  { columnName: "sheet_detail", width: 150 },
  { columnName: "warehouse", width: 150 },
  { columnName: "warehouse_from", width: 150 },
  { columnName: "warehouse_to", width: 150 },
  { columnName: "modified_info", width: 220 },
  { columnName: "confirm_info", width: 230 },
  { columnName: "status", width: 150 },
];

export const IMPORT_EXPORT_SHEET_HIDDEN_COLUMN_NAMES = [
  "warehouse_from",
  "warehouse_to",
  "sheet_detail",
];

export const TRANSFER_SHEET_HIDDEN_COLUMN_NAMES = ["order_key", "warehouse", "sheet_detail"];

export const CHECK_SHEET_HIDDEN_COLUMN_NAMES = [
  "order_key",
  "warehouse_from",
  "warehouse_to",
  "sheet_detail",
];

//  history

export const HISTORY_WAREHOUSE_COLUMNS: TColumn[] = [
  { name: "product_variant", title: SHEET_LABEL.variant },
  { name: "product_variant_batch", title: SHEET_LABEL.batch, type: "attribute" },
  { name: "quantity", title: SHEET_LABEL.quantity, type: "float" },
  { name: "sheet_info", title: SHEET_LABEL.sheet }, // type, sheet_code
  { name: "sheet_note", title: SHEET_LABEL.sheet_note },
  { name: "status", title: SHEET_LABEL.status },
  { name: "warehouse", title: SHEET_LABEL.warehouse },
  { name: "change_reason", title: SHEET_LABEL.change_reason },
  { name: "created_info", title: SHEET_LABEL.created_info }, // created, created_by
  { name: "modified_info", title: SHEET_LABEL.modified_info }, //modified, modified_by
  { name: "confirm_info", title: SHEET_LABEL.confirm_info }, //confirm_by, confirm_date
];

export const HISTORY_WAREHOUSE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "quantity", width: 80 },
  { columnName: "sheet_info", width: 180 },
  { columnName: "sheet_note", width: 150 },
  { columnName: "status", width: 180 },
  { columnName: "product_variant_batch", width: 120 },
  { columnName: "product_variant", width: 350 },
  { columnName: "warehouse", width: 120 },
  { columnName: "change_reason", width: 150 },
  { columnName: "created_info", width: 220 },
  { columnName: "modified_info", width: 220 },
  { columnName: "confirm_info", width: 250 },
];
export const HISTORY_DETAIL_HIDDEN_COLUMN_NAMES = ["warehouse"];

export const INVENTORY_COLUMNS: TColumn[] = [
  { name: "product_variant", title: INVENTORY_LOG_LABEL.product_variant },
  {
    name: "product_variant_batch",
    title: INVENTORY_LOG_LABEL.product_variant_batch,
    type: "attribute",
  },
  { name: "quantity", title: INVENTORY_LOG_LABEL.quantity, type: "float" },
  { name: "created_info", title: INVENTORY_LOG_LABEL.created_by },
  { name: "modified_info", title: INVENTORY_LOG_LABEL.modified_by },
];

export const INVENTORY_COLUMNS_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "quantity", width: 150 },
  { columnName: "product_variant", width: 350 },
  { columnName: "product_variant_batch", width: 150 },
  { columnName: "created_info", width: 160 },
  { columnName: "modified_info", width: 160 },
];

export const INVENTORY_COLUMNS_SHOW_SORT = [
  {
    name: "product_variant",
    fields: [
      { name: "name", title: PRODUCT_LABEL.name },
      { name: "SKU_code", title: PRODUCT_LABEL.SKU_code },
      { name: "bar_code", title: PRODUCT_LABEL.bar_code },
    ],
  },
  {
    name: "created_info",
    fields: [
      { name: "created", title: WAREHOUSE_LABEL.created },
      { name: "created_by", title: WAREHOUSE_LABEL.created_by },
    ],
  },
  {
    name: "modified_info",
    fields: [
      { name: "modified", title: WAREHOUSE_LABEL.modified },
      { name: "modified_by", title: WAREHOUSE_LABEL.modified_by },
    ],
  },
];

export const INVENTORY_COLUMNS_CO = map(INVENTORY_COLUMNS, (item) => item.name);

// warehouse scan - histoty
export const HISTORY_SCAN_COLUMNS: TColumn[] = [
  { name: "scan_at", title: SCAN_CODE_LABEL.scan_at, type: "datetime" },
  { name: "scan_by", title: SCAN_CODE_LABEL.scan_by, type: "user" },
  { name: "turn_number", title: SCAN_CODE_LABEL.turn_number },
  { name: "count", title: SCAN_CODE_LABEL.count },
];
export const HISTORY_SCAN_COLUMNS_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "scan_at", width: 250 },
  { columnName: "scan_by", width: 250 },
  { columnName: "count", width: 250 },
  { columnName: "turn_number", width: 250 },
];
export const HISTORY_SCAN_DETAIL_COLUMNS: TColumn[] = [
  { name: "scan_at", title: SCAN_CODE_LABEL.scan_at, type: "datetime" },
  { name: "scan_by", title: SCAN_CODE_LABEL.scan_by, type: "user" },
  { name: "scan_info", title: SCAN_CODE_LABEL.scan_info }, // sheet_type, order_key
  { name: "turn_number", title: SCAN_CODE_LABEL.turn_number },
  { name: "is_success", title: SCAN_CODE_LABEL.status, type: "boolean" },
  { name: "log_message", title: SCAN_CODE_LABEL.message },
];
export const HISTORY_SCAN_DETAIL_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "scan_at", width: 200 },
  { columnName: "scan_by", width: 200 },
  { columnName: "scan_info", width: 200 },
  { columnName: "turn_number", width: 150 },
  { columnName: "is_success", width: 150 },
  { columnName: "log_message", width: 500 },
];
export const SHEET_DETAIL_COLUMNS: TColumn[] = [
  { name: "product_variant", title: INVENTORY_LOG_LABEL.product_variant },
  {
    name: "product_variant_batch",
    title: INVENTORY_LOG_LABEL.product_variant_batch,
    type: "attribute",
  },
  { name: "quantity", title: INVENTORY_LOG_LABEL.quantity, type: "float" },
];

export const SHEET_DETAIL_COLUMNS_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "product_variant", width: 500 },
  { columnName: "product_variant_batch", width: 150 },
  { columnName: "quantity", width: 150 },
];

// batch
export const BATCH_COLUMNS: TColumn[] = [
  { name: "product_variant", title: INVENTORY_LOG_LABEL.product_variant },
  {
    name: "product_variant_batch",
    title: INVENTORY_LOG_LABEL.product_variant_batch,
    type: "attribute",
  },
  { name: "quantity", title: INVENTORY_LOG_LABEL.quantity, type: "float" },
  { name: "quantity_system", title: INVENTORY_LOG_LABEL.quantity_system, type: "float" },
  { name: "quantity_actual", title: INVENTORY_LOG_LABEL.quantity_actual, type: "float" },
];

export const BATCH_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "product_variant", width: 500 },
  { columnName: "product_variant_batch", width: 150 },
  { columnName: "quantity", width: 120 },
  { columnName: "quantity_system", width: 120 },
  { columnName: "quantity_actual", width: 150 },
];

export const WAREHOUSE_COLUMNS_SHOW_SORT = [
  {
    name: "manager_info",
    fields: [
      { name: "manager_name", title: WAREHOUSE_LABEL.manager_name },
      { name: "manager_phone", title: WAREHOUSE_LABEL.manager_phone },
    ],
  },
  {
    name: "created_info",
    fields: [
      { name: "created", title: WAREHOUSE_LABEL.created },
      { name: "created_by", title: WAREHOUSE_LABEL.created_by },
    ],
  },
];

export const SHEET_COLUMNS_SHOW_SORT = [
  {
    name: "created_info",
    fields: [
      { name: "created", title: SHEET_LABEL.created },
      { name: "created_by", title: SHEET_LABEL.created_by },
    ],
  },
  {
    name: "modified_info",
    fields: [
      { name: "modified", title: SHEET_LABEL.modified },
      { name: "modified_by", title: SHEET_LABEL.modified_by },
    ],
  },
  {
    name: "confirm_info",
    fields: [
      { name: "confirm_date", title: SHEET_LABEL.confirm_date },
      { name: "confirm_by", title: SHEET_LABEL.confirm_by },
    ],
  },
];

export const HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT = [
  {
    name: "created_info",
    fields: [
      { name: "created", title: SHEET_LABEL.created },
      { name: "created_by", title: SHEET_LABEL.created_by },
    ],
  },
  {
    name: "modified_info",
    fields: [
      { name: "modified", title: SHEET_LABEL.modified },
      { name: "modified_by", title: SHEET_LABEL.modified_by },
    ],
  },
  {
    name: "sheet_info",
    fields: [
      { name: "type", title: INVENTORY_LOG_LABEL.type },
      { name: "sheet_code", title: INVENTORY_LOG_LABEL.sheet_code },
    ],
  },
  {
    name: "product_variant",
    fields: [
      { name: "name", title: PRODUCT_LABEL.name },
      { name: "SKU_code", title: PRODUCT_LABEL.SKU_code },
      { name: "bar_code", title: PRODUCT_LABEL.bar_code },
    ],
  },
];

// product inventory
export const PRODUCT_INVENTORY_COLUMNS: TColumn[] = [
  { name: "images", title: INVENTORY_LOG_LABEL.image, type: "image", options: { onlyOne: true } },
  { name: "product_name", title: INVENTORY_LOG_LABEL.product_name },
  { name: "category_name", title: INVENTORY_LOG_LABEL.category_name },
  {
    name: "product_first_inventory",
    title: INVENTORY_LOG_LABEL.product_first_inventory,
    type: "float",
  },
  { name: "product_c_import", title: INVENTORY_LOG_LABEL.product_c_import, type: "float" },
  { name: "product_c_export", title: INVENTORY_LOG_LABEL.product_c_export, type: "float" },
  {
    name: "product_last_inventory",
    title: INVENTORY_LOG_LABEL.product_last_inventory,
    type: "float",
  },
];

export const PRODUCT_INVENTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "images", width: 80 },
  { columnName: "product_name", width: 150 },
  { columnName: "category_name", width: 150 },
  { columnName: "product_first_inventory", width: 100 },
  { columnName: "product_c_import", width: 120 },
  { columnName: "product_c_export", width: 120 },
  { columnName: "product_last_inventory", width: 120 },
];

// variant inventory
export const VARIANT_INVENTORY_COLUMNS: TColumn[] = [
  { name: "images", title: INVENTORY_LOG_LABEL.image, type: "image", options: { onlyOne: true } },
  { name: "variant_name", title: INVENTORY_LOG_LABEL.variant_name },
  { name: "variant_SKU_code", title: INVENTORY_LOG_LABEL.variant_SKU_code },
  {
    name: "variant_first_inventory",
    title: INVENTORY_LOG_LABEL.variant_first_inventory,
    type: "float",
  },
  { name: "variant_c_import", title: INVENTORY_LOG_LABEL.variant_c_import, type: "float" },
  { name: "variant_c_export", title: INVENTORY_LOG_LABEL.variant_c_export, type: "float" },
  {
    name: "variant_last_inventory",
    title: INVENTORY_LOG_LABEL.variant_last_inventory,
    type: "float",
  },
  {
    name: "sale_price",
    title: INVENTORY_LOG_LABEL.sale_price,
    type: "number",
  },
];

export const VARIANT_INVENTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "images", width: 80 },
  { columnName: "variant_name", width: 150 },
  { columnName: "variant_SKU_code", width: 120 },
  { columnName: "variant_first_inventory", width: 100 },
  { columnName: "variant_c_import", width: 120 },
  { columnName: "variant_c_export", width: 120 },
  { columnName: "variant_last_inventory", width: 120 },
  { columnName: "sale_price", width: 120 },
];

// batch inventory
export const BATCH_INVENTORY_COLUMNS: TColumn[] = [
  { name: "warehouse_name", title: INVENTORY_LOG_LABEL.warehouse_name },
  { name: "batch_name", title: INVENTORY_LOG_LABEL.batch_name },
  {
    name: "first_inventory",
    title: INVENTORY_LOG_LABEL.first_inventory,
    type: "float",
  },
  { name: "c_import", title: INVENTORY_LOG_LABEL.c_import, type: "float" },
  { name: "c_export", title: INVENTORY_LOG_LABEL.c_export, type: "float" },
  {
    name: "last_inventory",
    title: INVENTORY_LOG_LABEL.last_inventory,
    type: "float",
  },
];

export const BATCH_INVENTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "warehouse_name", width: 250 },
  { columnName: "batch_name", width: 150 },
  { columnName: "first_inventory", width: 100 },
  { columnName: "c_import", width: 120 },
  { columnName: "c_export", width: 120 },
  { columnName: "last_inventory", width: 120 },
];
