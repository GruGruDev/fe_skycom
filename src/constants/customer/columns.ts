import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ORDER_LABEL } from "constants/order/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { TColumn } from "types/DGrid";
import { CUSTOMER_LABEL } from "./label";

export const CUSTOMER_COLUMNS: TColumn[] = [
  { name: "customer_info", title: CUSTOMER_LABEL.customer }, // name, phone
  { name: "general_info", title: CUSTOMER_LABEL.general_info }, // email, birthday, gender
  { name: "created_info", title: CUSTOMER_LABEL.created }, // created, created_by
  { name: "group_info", title: CUSTOMER_LABEL.groups }, // source, groups
  { name: "customer_care_info", title: CUSTOMER_LABEL.customer_care_staff }, // customer_care_staff
  { name: "order_info", title: CUSTOMER_LABEL.order }, // total_order, shipping_completed_spent
  { name: "addresses", title: CUSTOMER_LABEL.addresses },
  { name: "customer_note", title: CUSTOMER_LABEL.customer_note },
  { name: "tags", title: CUSTOMER_LABEL.tags },
];

export const CUSTOMER_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "customer_info", width: 200 },
  { columnName: "general_info", width: 200 },
  { columnName: "created_info", width: 180 },
  { columnName: "group_info", width: 180 },
  { columnName: "customer_care_info", width: 180 },
  { columnName: "order_info", width: 200 },
  { columnName: "addresses", width: 200 },
  { columnName: "customer_note", width: 150 },
  { columnName: "tags", width: 150 },
];

export const CUSTOMER_COLUMNS_SHOW_SORT = [
  {
    name: "customer_info",
    fields: [
      { name: "name", title: CUSTOMER_LABEL.name },
      { name: "phones", title: CUSTOMER_LABEL.phones },
    ],
  },
  {
    name: "general_info",
    fields: [
      { name: "email", title: CUSTOMER_LABEL.email },
      { name: "gender", title: CUSTOMER_LABEL.gender },
      { name: "birthday", title: CUSTOMER_LABEL.birthday },
      {
        name: "rank",
        title: CUSTOMER_LABEL.rank,
      },
    ],
  },
  {
    name: "created_info",
    fields: [
      { name: "created", title: CUSTOMER_LABEL.created },
      { name: "created_by", title: CUSTOMER_LABEL.created_by },
    ],
  },
  {
    name: "group_info",
    fields: [
      { name: "source", title: CUSTOMER_LABEL.source },
      { name: "groups", title: CUSTOMER_LABEL.groups },
    ],
  },
  {
    name: "customer_care_info",
    fields: [
      {
        name: "customer_care_staff",
        title: CUSTOMER_LABEL.customer_care_staff,
      },
    ],
  },
  {
    name: "order_info",
    fields: [
      {
        name: "total_spent",
        title: CUSTOMER_LABEL.total_spent,
      },
      {
        name: "total_order",
        title: CUSTOMER_LABEL.total_order,
      },
    ],
  },
];

/**
 * simple columns
 */

export const CUSTOMER_SIMPLE_SORT_COLUMNS: TColumn[] = [
  { name: "name", title: CUSTOMER_LABEL.name },
  { name: "birthday", title: CUSTOMER_LABEL.birthday },
  { name: "birthday_day", title: CUSTOMER_LABEL.birthday_day },
  { name: "birthday_month", title: CUSTOMER_LABEL.birthday_month },
  { name: "rank", title: CUSTOMER_LABEL.rank },
  { name: "total_order", title: CUSTOMER_LABEL.total_order },
  { name: "total_spent", title: CUSTOMER_LABEL.total_spent },
  { name: "last_order_time", title: CUSTOMER_LABEL.last_order_time },
  { name: "created", title: CUSTOMER_LABEL.created },
];

export const CUSTOMER_SIMPLE_COLUMNS: TColumn[] = [
  { name: "name", title: CUSTOMER_LABEL.name },
  { name: "phones", title: CUSTOMER_LABEL.phone_number },
  { name: "email", title: CUSTOMER_LABEL.email },
  { name: "birthday", title: CUSTOMER_LABEL.birthday, type: "date" },
  { name: "gender", title: CUSTOMER_LABEL.gender, type: "gender" },
  { name: "rank", title: CUSTOMER_LABEL.rank },
  { name: "source", title: CUSTOMER_LABEL.source },
  { name: "groups", title: CUSTOMER_LABEL.groups },
  { name: "customer_care_staff", title: CUSTOMER_LABEL.customer_care_staff, type: "user" },
  { name: "total_order", title: CUSTOMER_LABEL.total_order, type: "number" },
  { name: "total_spent", title: CUSTOMER_LABEL.total_spent, type: "number" },
  { name: "last_order_time", title: CUSTOMER_LABEL.last_order_time, type: "date" },
  { name: "addresses", title: CUSTOMER_LABEL.addresses },
  { name: "customer_note", title: CUSTOMER_LABEL.customer_note },
  { name: "tags", title: CUSTOMER_LABEL.tags },
  { name: "created", title: CUSTOMER_LABEL.created, type: "datetime" },
  { name: "created_by", title: CUSTOMER_LABEL.created_by, type: "user" },
];

export const CUSTOMER_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 120 },
  { columnName: "phones", width: 120 },
  { columnName: "email", width: 150 },
  { columnName: "birthday", width: 120 },
  { columnName: "gender", width: 120 },
  { columnName: "rank", width: 120 },
  { columnName: "source", width: 120 },
  { columnName: "groups", width: 120 },
  { columnName: "customer_care_staff", width: 150 },
  { columnName: "total_order", width: 150 },
  { columnName: "total_spent", width: 150 },
  { columnName: "last_order_time", width: 140 },
  { columnName: "addresses", width: 150 },
  { columnName: "customer_note", width: 200 },
  { columnName: "tags", width: 150 },
  { columnName: "created", width: 120 },
  { columnName: "created_by", width: 120 },
];

export const CUSTOMER_HISTORY_COLUMN: TColumn[] = [
  { title: CUSTOMER_LABEL.created, name: "created", type: "datetime" },
  { title: CUSTOMER_LABEL.created_by, name: "created_by", type: "user" },
  { title: CUSTOMER_LABEL.modified_by, name: "modified_by", type: "user" },
  { title: CUSTOMER_LABEL.modified, name: "modified", type: "date" },
  { title: CUSTOMER_LABEL.history_type, name: "history_type" },
  { title: CUSTOMER_LABEL.history_change_reason, name: "history_change_reason" },
];

export const CUSTOMER_HISTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 130, columnName: "created" },
  { width: 130, columnName: "created_by" },
  { width: 130, columnName: "modified_by" },
  { width: 130, columnName: "modified" },
  { width: 130, columnName: "history_type" },
  { width: 350, columnName: "history_change_reason" },
];

export const CUSTOMER_ORDER_COLUMN: TColumn[] = [
  { title: ORDER_LABEL.order_key, name: "order_key" },
  { title: ORDER_LABEL.status, name: "status" },
  { title: ORDER_LABEL.complete_time, name: "complete_time", type: "datetime" },
  { title: ORDER_LABEL.source, name: "source", type: "attribute" },
  { title: ORDER_LABEL.tags, name: "tags" },
  { title: ORDER_LABEL.tracking_number, name: "tracking_number" },
  { title: ORDER_LABEL.price_total_order_actual, name: "price_total_order_actual", type: "number" },
];

export const CUSTOMER_ORDER_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 130, columnName: "order_key" },
  { width: 130, columnName: "status" },
  { width: 160, columnName: "complete_time" },
  { width: 130, columnName: "source" },
  { width: 130, columnName: "tags" },
  { width: 130, columnName: "tracking_number" },
  { width: 130, columnName: "price_total_order_actual" },
];

export const CUSTOMER_PRODUCT_COLUMN: TColumn[] = [
  { title: PRODUCT_LABEL.product, name: "product_info" },
  { title: PRODUCT_LABEL.price_info, name: "price_info" },
  { title: PRODUCT_LABEL.quantity, name: "quantity" },
];

export const CUSTOMER_PRODUCT_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { width: 350, columnName: "product_info" },
  { width: 300, columnName: "price_info" },
  { width: 160, columnName: "quantity" },
];
