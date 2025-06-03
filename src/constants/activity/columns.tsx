import { USER_LABEL } from "constants/user/label";
import { TColumn } from "types/DGrid";
import { ACTIVITY_LABEL } from "./label";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

export const ACTIVITY_COLUMNS: TColumn[] = [
  { name: "action_time", title: ACTIVITY_LABEL.action_time, type: "datetime" },
  // { name: "detail", title: ACTIVITY_LABEL.detail },
  { name: "user", title: USER_LABEL.name, type: "user" },
  { name: "action_type", title: ACTIVITY_LABEL.action_type },
  { name: "action_name", title: ACTIVITY_LABEL.action_name },
  { name: "message", title: ACTIVITY_LABEL.message },
];

export const ACTIVITY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "action_time", width: 120 },
  // { columnName: "detail", width: 120 },
  { columnName: "user", width: 150 },
  { columnName: "action_type", width: 120 },
  { columnName: "action_name", width: 150 },
  { columnName: "message", width: 350 },
];
