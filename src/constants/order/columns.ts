import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnShowSortType, TColumn } from "types/DGrid";
import { ORDER_LABEL } from "./label";
import { AirTableColumnTypes } from "components/Pivot/Filter/types";
import { PIVOT_LABEL } from "constants/pivot/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { USER_LABEL } from "constants/user/label";

export const ORDER_COLUMNS: TColumn[] = [
  { name: "order_info", title: PIVOT_LABEL.order_info }, // order_key, source
  { name: "status", title: PIVOT_LABEL.status },
  { name: "general_info", title: PIVOT_LABEL.general_info }, // value_cross_sale, tags, sale_note
  { name: "create_info", title: PIVOT_LABEL.create_info }, // created, created_by
  { name: "handle_info", title: PIVOT_LABEL.handle_info }, // complete_time, modified, modified_by, appointment_date
  // price_info: price_total_variant_actual, price_delivery_input, price_addition_input, price_discount_input, price_total_discount_order_promotion, price_total_order_actual
  { name: "price_info", title: PIVOT_LABEL.price_info },
  // payments
  { name: "payments", title: PIVOT_LABEL.payments },
  { name: "cancel_reason", title: PIVOT_LABEL.cancel_reason },
  // delete from table
];

export const ORDER_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "order_info", width: 200 },
  { columnName: "status", width: 150 },
  { columnName: "general_info", width: 200 },
  { columnName: "create_info", width: 250 },
  { columnName: "handle_info", width: 250 },
  { columnName: "price_info", width: 200 },
  { columnName: "payments", width: 280 },
  { columnName: "cancel_reason", width: 200 },
];

export const ORDER_HIDDEN_COLUMN_NAMES = ["cancel_reason"];

/** ORDER SIMPLE COLUMNS */

export const ORDER_SIMPLE_COLUMNS: TColumn[] = [
  { name: "export_sheet", title: ORDER_LABEL.export_sheet },
  { name: "created", title: ORDER_LABEL.created, type: "datetime" },
  { name: "order_key", title: ORDER_LABEL.order_key },
  { name: "name_shipping", title: ORDER_LABEL.name_shipping },
  { name: "phone_shipping", title: ORDER_LABEL.phone_shipping, type: "phone" },
  { name: "status", title: ORDER_LABEL.status },
  {
    name: "price_total_variant_actual",
    title: ORDER_LABEL.price_total_variant_actual,
    type: "number",
  },
  {
    name: "price_total_variant_actual_input",
    title: ORDER_LABEL.price_total_variant_actual_input,
    type: "number",
  },
  { name: "price_total_order_actual", title: ORDER_LABEL.price_total_order_actual, type: "number" },
  { name: "payments", title: ORDER_LABEL.payment },
  { name: "sheet", title: ORDER_LABEL.sheet },
  { name: "sale_note", title: ORDER_LABEL.sale_note },
  { name: "created_by", title: ORDER_LABEL.created_by, type: "user" },
  { name: "customer_care_staff", title: ORDER_LABEL.customer_care_staff },
  { name: "complete_time", title: ORDER_LABEL.complete_time, type: "datetime" },
  { name: "modified", title: ORDER_LABEL.modified, type: "datetime" },
  { name: "modified_by", title: ORDER_LABEL.modified_by, type: "user" },
  { name: "appointment_date", title: ORDER_LABEL.appointment_date, type: "datetime" },
  { name: "price_delivery_input", title: ORDER_LABEL.price_delivery_input, type: "number" },
  { name: "price_addition_input", title: ORDER_LABEL.price_addition_input, type: "number" },
  { name: "price_discount_input", title: ORDER_LABEL.price_discount_input, type: "number" },
  {
    name: "price_total_discount_order_promotion",
    title: ORDER_LABEL.price_total_discount_order_promotion,
    type: "number",
  },
  { name: "source", title: ORDER_LABEL.source, type: "attribute" },
  { name: "cancel_reason", title: ORDER_LABEL.cancel_reason, type: "attribute" },
  { name: "tags", title: ORDER_LABEL.tags },
];

export const ORDER_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "export_sheet", width: 100 },
  { columnName: "order_key", width: 120 },
  { columnName: "source", width: 120 },
  { columnName: "status", width: 120 },
  { columnName: "sale_note", width: 120 },
  { columnName: "name_shipping", width: 150 },
  { columnName: "phone_shipping", width: 140 },
  { columnName: "created", width: 120 },
  { columnName: "created_by", width: 120 },
  { columnName: "sheet", width: 120 },
  { columnName: "complete_time", width: 140 },
  { columnName: "modified", width: 120 },
  { columnName: "customer_care_staff", width: 130 },
  { columnName: "modified_by", width: 120 },
  { columnName: "appointment_date", width: 130 },
  { columnName: "price_total_variant_actual", width: 110 },
  { columnName: "price_total_variant_actual_input", width: 150 },
  { columnName: "price_delivery_input", width: 90 },
  { columnName: "price_addition_input", width: 90 },
  { columnName: "price_discount_input", width: 90 },
  { columnName: "price_total_discount_order_promotion", width: 110 },
  { columnName: "price_total_order_actual", width: 130 },
  { columnName: "payments", width: 250 },
  { columnName: "cancel_reason", width: 120 },
  { columnName: "tags", width: 120 },
];

export const ORDER_HISTORY_COLUMN: TColumn[] = [
  { name: "created", title: ORDER_LABEL.created, type: "datetime" },
  { name: "created_by", title: ORDER_LABEL.created_by, type: "user" },
  { name: "history_date", title: PIVOT_LABEL.history_date, type: "datetime" },
  { name: "modified_by", title: PIVOT_LABEL.modified_by, type: "attribute" },
  { name: "history_type", title: PIVOT_LABEL.history_type },
  { name: "history_change_reason", title: ORDER_LABEL.history_change_reason },
];

export const ORDER_HISTORY_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created", width: 160 },
  { columnName: "created_by", width: 160 },
  { columnName: "history_date", width: 160 },
  { columnName: "modified_by", width: 130 },
  { columnName: "history_type", width: 120 },
  { columnName: "history_change_reason", width: 350 },
];

export const ORDER_SORT_COLUMNS: ColumnShowSortType[] = [
  {
    name: "order_info",
    fields: [
      { name: "order_key", title: ORDER_LABEL.order_key },
      { name: "source", title: ORDER_LABEL.source },
    ],
  },
  {
    name: "general_info",
    fields: [
      { name: "value_cross_sale", title: ORDER_LABEL.value_cross_sale },
      { name: "tags", title: ORDER_LABEL.tags },
    ],
  },
  {
    name: "create_info",
    fields: [
      { name: "created", title: ORDER_LABEL.created },
      { name: "created_by", title: ORDER_LABEL.created_by },
    ],
  },
  {
    name: "handle_info",
    fields: [
      { name: "complete_time", title: ORDER_LABEL.completed_time },
      { name: "modified", title: ORDER_LABEL.modified },
      { name: "modified_by", title: ORDER_LABEL.modified_by },
      { name: "appointment_date", title: ORDER_LABEL.appointment_time },
    ],
  },
  {
    name: "price_info",
    fields: [
      { name: "price_total_variant_actual", title: ORDER_LABEL.price_total_variant_actual },
      {
        name: "price_total_variant_actual_input",
        title: ORDER_LABEL.price_total_variant_actual_input,
      },
      { name: "price_delivery_input", title: ORDER_LABEL.price_delivery_input },
      { name: "price_addition_input", title: ORDER_LABEL.price_addition_input },
      { name: "price_discount_input", title: ORDER_LABEL.price_discount_input },
      {
        name: "price_total_discount_order_promotion",
        title: ORDER_LABEL.price_total_discount_order_promotion,
      },
      { name: "price_total_order_actual", title: ORDER_LABEL.price_total_order_actual },
    ],
  },
];

export const ORDER_PAYMENT_COLUMN: TColumn[] = [
  { name: "type", title: ORDER_LABEL.type },
  { name: "price_from_order", title: ORDER_LABEL.price_from_order, type: "number" },
  { name: "is_confirm", title: ORDER_LABEL.is_confirm, type: "boolean" },
  { name: "date_confirm", title: ORDER_LABEL.date_confirm, type: "datetime" },
  {
    name: "images",
    title: ORDER_LABEL.confirm_payment_image,
    type: "image",
    options: { onlyOne: true },
  },
];

export const ORDER_PAYMENT_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "type", width: 200 },
  { columnName: "price_from_order", width: 160 },
  { columnName: "is_confirm", width: 160 },
  { columnName: "date_confirm", width: 160 },
  { columnName: "images", width: 160 },
];

// created_date, source, shipping_status, status, created_by, complete_by, complete_date, shipping_date, province, warehouse_exdate

export const ORDER_REPORT_DIMENTIONS: TColumn[] = [
  // { name: "created_date", title: ORDER_LABEL.created_date },
  { name: "source__id", title: ORDER_LABEL.source, filterType: AirTableColumnTypes.SINGLE_SELECT },
  {
    name: "shipping_status",
    title: ORDER_LABEL.shipping_status,
    filterType: AirTableColumnTypes.SINGLE_SELECT,
  },
  { name: "status", title: ORDER_LABEL.status, filterType: AirTableColumnTypes.SINGLE_SELECT },
  {
    name: "created_by__id",
    title: ORDER_LABEL.created_by,
    filterType: AirTableColumnTypes.SINGLE_USER,
  },
  {
    name: "complete_date",
    title: ORDER_LABEL.complete_time,
    type: "date",
    filterType: AirTableColumnTypes.DATE,
  },
  {
    name: "complete_by__id",
    title: ORDER_LABEL.complete_by,
    filterType: AirTableColumnTypes.SINGLE_USER,
  },
  {
    name: "shipping_date",
    title: ORDER_LABEL.shipping_date,
    type: "date",
    filterType: AirTableColumnTypes.DATE,
  },
  {
    name: "warehouse_exdate",
    title: ORDER_LABEL.warehouse_exdate,
    type: "date",
    filterType: AirTableColumnTypes.DATE,
  },
  { name: "province", title: ORDER_LABEL.province, filterType: AirTableColumnTypes.SINGLE_SELECT },
];

// revenue, pre_promo_revenue, after_promo_revenue, total_prod_discount, total_order_discount, total_order_quantity, total_prod_quantity,
// total_gift_quantity, total_addi_fee, total_ship_fee, total_discount_input, avg_order_value, avg_items_count
export const ORDER_REPORT_METRICS: TColumn[] = [
  { name: "revenue", title: ORDER_LABEL.revenue, type: "number" },
  { name: "pre_promo_revenue", title: ORDER_LABEL.pre_promo_revenue, type: "number" },
  { name: "after_promo_revenue", title: ORDER_LABEL.after_promo_revenue, type: "number" },
  { name: "total_prod_discount", title: ORDER_LABEL.total_prod_discount, type: "number" },
  { name: "total_order_discount", title: ORDER_LABEL.total_order_discount, type: "number" },
  { name: "total_order_quantity", title: ORDER_LABEL.total_order_quantity, type: "number" },
  { name: "total_prod_quantity", title: ORDER_LABEL.total_prod_quantity, type: "number" },
  { name: "total_gift_quantity", title: ORDER_LABEL.total_gift_quantity, type: "number" },
  { name: "total_addi_fee", title: ORDER_LABEL.total_addi_fee, type: "number" },
  { name: "total_ship_fee", title: ORDER_LABEL.total_ship_fee, type: "number" },
  { name: "total_discount_input", title: ORDER_LABEL.total_discount_input, type: "number" },
  { name: "avg_order_value", title: ORDER_LABEL.avg_order_value, type: "number" },
  { name: "avg_items_count", title: ORDER_LABEL.avg_items_count, type: "number" },
];

export const ORDER_REPORT_METRICS_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "revenue", width: 150 },
  { columnName: "pre_promo_revenue", width: 150 },
  { columnName: "after_promo_revenue", width: 150 },
  { columnName: "total_prod_discount", width: 150 },
  { columnName: "total_order_discount", width: 150 },
  { columnName: "total_order_quantity", width: 150 },
  { columnName: "total_addi_fee", width: 150 },
  { columnName: "total_ship_fee", width: 150 },
  { columnName: "total_discount_input", width: 150 },
  { columnName: "avg_order_value", width: 150 },
  { columnName: "avg_items_count", width: 150 },
];

export const ORDER_REPORT_VARIANT_REVENUE_COLUMNS: TColumn[] = [
  { name: "images", title: PRODUCT_LABEL.images, type: "image", options: { onlyOne: true } },
  { name: "SKU_code", title: PRODUCT_LABEL.SKU_code },
  { name: "name", title: PRODUCT_LABEL.name },
  { name: "revenue", title: PRODUCT_LABEL.revenue, type: "number" },
  { name: "sold_quantity", title: PRODUCT_LABEL.sold_quantity, type: "number" },
  { name: "inventory_quantity", title: PRODUCT_LABEL.inventory_quantity, type: "number" },
];

export const ORDER_REPORT_VARIANT_REVENUE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "images", width: 100 },
  { columnName: "SKU_code", width: 120 },
  { columnName: "revenue", width: 120 },
  { columnName: "sold_quantity", width: 150 },
  { columnName: "name", width: 150 },
  { columnName: "inventory_quantity", width: 150 },
];

export const CARRIER_BY_REVENUE_COLUMNS: TColumn[] = [
  { name: "sale_name", title: USER_LABEL.name },
  { name: "total_order", title: USER_LABEL.total_order, type: "number" },
  { name: "total_revenue", title: USER_LABEL.total_revenue, type: "number" },
  { name: "total_commission", title: USER_LABEL.total_commission, type: "number" },
];
export const CARRIER_BY_REVENUE_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "sale_name", width: 150 },
  { columnName: "total_order", width: 120 },
  { columnName: "total_revenue", width: 120 },
  { columnName: "total_commission", width: 160 },
];
