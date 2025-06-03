import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { TColumn } from "types/DGrid";
import { USER_LABEL } from "./label";
import { LABEL } from "constants/label";

export const ACCOUNT_COLUMNS: TColumn[] = [
  { name: "accountInfo", title: USER_LABEL.account_info }, // name, email, phone, images
  { name: "is_active", title: USER_LABEL.is_active },
  { name: "is_online", title: USER_LABEL.is_online },
  { name: "is_assign_lead_campaign", title: USER_LABEL.is_assign_lead_campaign },
];

export const ACCOUNT_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "accountInfo", width: 300 },
  { columnName: "is_active", width: 130 },
  { columnName: "is_online", width: 100 },
  { columnName: "is_assign_lead_campaign", width: 100 },
];

/**
 * simple table
 */

export const ACCOUNT_SIMPLE_COLUMNS: TColumn[] = [
  { name: "images", title: USER_LABEL.image, type: "image", options: { onlyOne: true } }, //
  { name: "name", title: USER_LABEL.name }, //
  { name: "email", title: USER_LABEL.email }, //
  { name: "phone", title: USER_LABEL.phone }, //
  { name: "department", title: USER_LABEL.department }, //
  { name: "role", title: USER_LABEL.role }, //
  { name: "is_online", title: USER_LABEL.is_online },
  { name: "is_assign_lead_campaign", title: USER_LABEL.is_assign_lead_campaign },
  { name: "is_active", title: USER_LABEL.is_active },
];

export const ACCOUNT_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "images", width: 120 }, //
  { columnName: "name", width: 120 }, //
  { columnName: "email", width: 170 }, //
  { columnName: "phone", width: 120 }, //
  { columnName: "department", width: 150 }, //
  { columnName: "role", width: 150 }, //
  { columnName: "is_online", width: 135 },
  { columnName: "is_assign_lead_campaign", width: 135 },
  { columnName: "is_active", width: 150 },
];
/**
 * -----------
 */

export const PERMISSION_COLUMNS: TColumn[] = [
  { name: "name", title: USER_LABEL.name },
  { name: "default_router", title: USER_LABEL.default_router },
];

export const PERMISSION_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "name", width: 240 },
  { columnName: "default_router", width: 300 },
];

export const ACCOUNT_HISTORY_COLUMN: TColumn[] = [
  { name: "created", title: LABEL.CREATED, type: "datetime" },
  { name: "history_date", title: LABEL.MODIFIED, type: "datetime" },
  { name: "history_user", title: LABEL.MODIFIED_BY, type: "user" },
  { name: "history_type", title: LABEL.HISTORY_TYPE },
  { name: "history_change_reason", title: LABEL.HISTORY_CHANGE_REASON },
];

export const ACCOUNT_HISTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "created", width: 150 },
  { columnName: "history_date", width: 150 },
  { columnName: "history_user", width: 150 },
  { columnName: "history_type", width: 150 },
  { columnName: "history_change_reason", width: 400 },
];

export const ACCOUNT_COLUMNS_SHOW_SORT = [
  {
    name: "accountInfo",
    fields: [
      { name: "name", title: USER_LABEL.name },
      { name: "email", title: USER_LABEL.email },
      { name: "phone", title: USER_LABEL.phone },
    ],
  },
];
