import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { TColumn } from "types/DGrid";
import { DASHBOARD_LABEL } from "./label";

export const TOP_PRODUCT_BY_REVENUE_COLUMNS: TColumn[] = [
  { name: "images", title: DASHBOARD_LABEL.images, type: "image", options: { onlyOne: true } },
  { name: "SKU_code", title: DASHBOARD_LABEL.SKU_code },
  { name: "variant_name", title: DASHBOARD_LABEL.variant_name },
  { name: "total_price", title: DASHBOARD_LABEL.total_price, type: "number" },
  { name: "total_quantity", title: DASHBOARD_LABEL.total_quantity, type: "number" },
];
export const TOP_PRODUCT_BY_REVENUE_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "images", width: 100 },
  { columnName: "SKU_code", width: 120 },
  { columnName: "total_price", width: 120 },
  { columnName: "total_quantity", width: 120 },
  { columnName: "variant_name", width: 150 },
];

export const TOP_TELESALE_BY_REVENUE_COLUMNS: TColumn[] = [
  { name: "sale_name", title: DASHBOARD_LABEL.sale_name },
  { name: "total_order", title: DASHBOARD_LABEL.total_order, type: "number" },
  { name: "total_revenue", title: DASHBOARD_LABEL.total_revenue, type: "number" },
  { name: "total_cross_sale", title: DASHBOARD_LABEL.total_cross_sale, type: "number" },
  { name: "total_revenue_crm", title: DASHBOARD_LABEL.total_revenue_crm, type: "number" },
];
export const TOP_TELESALE_BY_REVENUE_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "sale_name", width: 150 },
  { columnName: "total_order", width: 120 },
  { columnName: "total_revenue", width: 120 },
  { columnName: "total_cross_sale", width: 160 },
  { columnName: "total_revenue_crm", width: 160 },
];

export const REVENUE_BY_SOURCE_COLUMNS: TColumn[] = [
  { name: "source_name", title: DASHBOARD_LABEL.source_name },
  { name: "total_order", title: DASHBOARD_LABEL.total_order, type: "number" },
  {
    name: "price_total_variant_all",
    title: DASHBOARD_LABEL.price_total_variant_all,
    type: "number",
  },
  {
    name: "price_total_order_actual",
    title: DASHBOARD_LABEL.price_total_order_actual,
    type: "number",
  },
  { name: "paid", title: DASHBOARD_LABEL.paid, type: "number" },
  { name: "price_pre_paid", title: DASHBOARD_LABEL.price_pre_paid, type: "number" },
];
export const REVENUE_BY_SOURCE_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "source_name", width: 150 },
  { columnName: "paid", width: 175 },
  { columnName: "price_pre_paid", width: 160 },
  { columnName: "price_total_order_actual", width: 140 },
  { columnName: "price_total_variant_all", width: 170 },
  { columnName: "total_order", width: 120 },
];
