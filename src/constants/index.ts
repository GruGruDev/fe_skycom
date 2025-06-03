import { TSettingsValueProps } from "types/Setting";
import { PaletteColor } from "types/Styles";
import { BUTTON } from "./button";
import { TSelectOption } from "types/SelectOption";
import { HISTORY_ACTIONS } from "types/History";
import { LABEL } from "./label";
import { TColumn } from "types/DGrid";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

export const ALL = LABEL.ALL;
export const ALL_OPTION: TSelectOption = { label: ALL, value: "all" };
export const NONE = LABEL.NONE;
export const NULL_OPTION = { label: NONE, value: "null" };
export const FULL_OPTIONS = [
  { label: ALL, value: "all" },
  { label: NONE, value: "null" },
];

export const SIMPLE_CELL_HEIGHT = "2rem";

export const ZINDEX_SYSTEM = {
  dialog: 1304,
  picker: 1305,
  selector: 1305,
  drawer: 1300,
};

export const CURRENCY_UNIT = {
  // eslint-disable-next-line vietnamese/vietnamese-words
  VND: "đ",
};

export const SALE_GROUP_NAME = "SKY_SALES";

export const INIT_ATTRIBUTE_OPTIONS: TSelectOption[] = [
  { label: ALL, value: "all" },
  { label: NONE, value: "null" },
];

export const FILTER_GROUPS = [
  { name: LABEL.PEOPLE, labels: ["handle_by", "order_created", "created_by"], values: [] },
  { name: LABEL.DATE, labels: [""], values: [] },
  {
    name: LABEL.REASON,
    labels: [
      "late_reason",
      "wait_return_reason",
      "returning_reason",
      "after_bad_data_reason",
      "fail_reason",
      "reason_exports",
      "reason_imports",
      "reason_transfer",
      "reason_stocktakings",
    ],
    values: [],
  },
  { name: LABEL.OTHER, labels: [""], values: [] },
];

export const HISTORY_ACTION_TYPES: {
  value: HISTORY_ACTIONS;
  label: string;
  color: PaletteColor;
}[] = [
  { value: HISTORY_ACTIONS.UPDATE, label: BUTTON.UPDATE, color: "primary" },
  { value: HISTORY_ACTIONS.CREATE, label: BUTTON.ADD, color: "info" },
  { value: HISTORY_ACTIONS.ADD, label: BUTTON.ADD, color: "info" },
  { value: HISTORY_ACTIONS.PRINT, label: BUTTON.PRINT, color: "secondary" },
  { value: HISTORY_ACTIONS.CONFIRM, label: BUTTON.CONFIRM, color: "success" },
  { value: HISTORY_ACTIONS.CANCEL, label: BUTTON.CANCEL, color: "error" },
];

export const PAGE_SIZES = [10, 30, 50, 100, 200, 500, 1000, 5000, 10000];

export enum TYPE_FORM_FIELD {
  TEXTFIELD = "TEXTFIELD",
  UPLOAD_IMAGE = "UPLOAD_IMAGE",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  COLOR = "COLOR",
  SINGLE_SELECT = "SINGLE_SELECT",
  DATE = "DATE",
  NUMBER = "NUMBER",
  DATE_TIME = "DATE_TIME",
  SWITCH = "SWITCH",
  UPLOAD_AVATAR = "UPLOAD_AVATAR",
  PASSWORD = "PASSWORD",
}

export const SEARCH_INPUT_LABEL = "searchInput";

export enum OPERATORS {
  larger = "larger",
  smaller = "smaller",
  largerOrEqual = "largerOrEqual",
  smallerOrEqual = "smallerOrEqual",
}

export const PHONE_REGEX = /^([\+84|84|0]+(2|3|4|5|6|7|8|9|1[2|6|8|9]))+([0-9]{8}|[0-9]{9})\b/;

export const BOTTOM_PAGE_HEIGHT = 47; // độ cao dòng license

export const COMMAS_REGEX = /\B(?=(\d{3})+(?!\d))/g;

export const HEIGHT_DEVICE = window.innerHeight;
export const WIDTH_DEVICE = window.innerWidth;
export const HEIGHT_HEADER_BAR_APP = 40;
export const HEIGHT_PAGINATION_TABLE = 80;
export const HEIGHT_PAGINATION_TABLE_DETAIL = 150;
export const HEADER_PAGE_HEIGHT = 56;

export const defaultSettings: TSettingsValueProps = {
  themeMode: "light",
  themeDirection: "ltr",
  themeColor: "default",
  themeLayout: "vertical",
  themeStretch: false,
  tableLayout: "simple",
  version: null,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const HEADER = {
  MOBILE_HEIGHT: 56,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 20,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 70 - 32,
};
export const FOOTER = {
  HEIGHT: 20,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

export const DRAWER_WIDTH = 240;
export const COLLAPSE_WIDTH = 90;

export const SIDEBAR_WIDTH = `calc(100% - ${DRAWER_WIDTH + 1}px)`;

export const HISTORY_COLUMNS: TColumn[] = [
  { name: "history_date", title: LABEL.HISTORY, type: "datetime" },
  { name: "history_user", title: LABEL.HISTORY_USER, type: "user" },
  { name: "history_type", title: LABEL.HISTORY_TYPE },
  { name: "history_change_reason", title: LABEL.HISTORY_CHANGE_REASON },
];

export const HISTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "history_date", width: 150 },
  { columnName: "history_user", width: 150 },
  { columnName: "history_type", width: 150 },
  { columnName: "history_change_reason", width: 400 },
];
