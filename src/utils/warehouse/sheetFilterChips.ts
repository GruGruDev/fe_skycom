import { FilterChipType } from "components/Table/Header/FilterChip";
import { ALL_OPTION } from "constants/index";
import { LABEL } from "constants/label";
import {
  CHANGE_REASON_FILTER_LABEL,
  SHEET_TYPE_OPTIONS,
  CONFIRM_STATUS_OPTIONS,
} from "constants/warehouse";
import { SCAN_CODE_LABEL, SHEET_LABEL, WAREHOUSE_LABEL } from "constants/warehouse/label";
import map from "lodash/map";
import { TAttribute } from "types/Attribute";
import { TDateFilter } from "types/Filter";
import { TSelectOption } from "types/SelectOption";
import { TSheetType } from "types/Sheet";
import { TUser } from "types/User";
import { formatOptionSelect } from "utils/option";

export interface SheetChipType {
  users: TUser[];
  inventoryReasonOptions?: TAttribute[];
  warehouseOptions: TSelectOption[];
  productCategoryOptions: TSelectOption[];
  typeDisabled?: boolean;
  type?: TSheetType;
}

export const sheetFilterChips = ({
  users,
  inventoryReasonOptions,
  productCategoryOptions,
  warehouseOptions,
  typeDisabled,
  type,
}: SheetChipType): FilterChipType[] | undefined => [
  {
    type: "select",
    keysFilter: {
      label: "type",
      title: SHEET_LABEL.type,
      disabled: typeDisabled,
    },
    options: SHEET_TYPE_OPTIONS,
  },
  { type: "date", dateFilterKeys: CONFIRM_DATE_FILTER_COLOR },
  { type: "date", dateFilterKeys: CREATED_FILTER_COLOR },
  {
    type: "select",
    keysFilter: {
      label: "is_confirm",
      color: "#f79191",
      title: SHEET_LABEL.is_confirm,
    },
    options: CONFIRM_STATUS_OPTIONS,
  },
  {
    type: "select",
    options: [ALL_OPTION, ...map(inventoryReasonOptions, formatOptionSelect)],
    keysFilter: { label: "change_reason", title: type && CHANGE_REASON_FILTER_LABEL[type] },
  },
  {
    type: "select",
    keysFilter: {
      label: "created_by",
      title: WAREHOUSE_LABEL.created_by,
    },
    options: map(users, formatOptionSelect),
  },
  {
    type: "select",
    keysFilter: {
      label: "confirm_by",
      title: SHEET_LABEL.confirm_by,
    },
    options: map(users, formatOptionSelect),
  },
  {
    type: "select",
    options: [ALL_OPTION, ...warehouseOptions],
    keysFilter: { label: "warehouse", title: SHEET_LABEL.warehouse },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...warehouseOptions],
    keysFilter: { label: "warehouse_from", title: SHEET_LABEL.warehouse_from },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...warehouseOptions],
    keysFilter: { label: "warehouse_to", title: SHEET_LABEL.warehouse_to },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...productCategoryOptions],
    keysFilter: { label: "category", title: SHEET_LABEL.category },
    mode: "single",
  },
  {
    type: "select",
    keysFilter: {
      label: "scan_by",
      title: SCAN_CODE_LABEL.scan_by,
    },
    options: map(users, formatOptionSelect),
  },
  { type: "date", dateFilterKeys: SCAN_AT_FILTER_COLOR },
];

const CREATED_FILTER_COLOR: TDateFilter[] = [
  {
    title: LABEL.CREATED,
    keyFilters: [
      { label: "created_from", color: "#91f7d3", title: LABEL.CREATED_FROM },
      { label: "created_to", color: "#91f7d3", title: LABEL.CREATED_TO },
      { label: "dateValue" },
    ],
  },
];
const SCAN_AT_FILTER_COLOR: TDateFilter[] = [
  {
    title: WAREHOUSE_LABEL.confirmed_date,
    keyFilters: [
      { label: "scan_at_from", color: "#91f7d3", title: SCAN_CODE_LABEL.scan_at },
      { label: "scan_at_to", color: "#91f7d3", title: SCAN_CODE_LABEL.scan_at },
      { label: "dateValue" },
    ],
  },
];
const CONFIRM_DATE_FILTER_COLOR: TDateFilter[] = [
  {
    title: WAREHOUSE_LABEL.confirmed_date,
    keyFilters: [
      { label: "confirm_date_from", color: "#91f7d3", title: WAREHOUSE_LABEL.confirmed_date_from },
      { label: "confirm_date_to", color: "#91f7d3", title: WAREHOUSE_LABEL.confirmed_date_to },
      { label: "dateValue" },
    ],
  },
];
