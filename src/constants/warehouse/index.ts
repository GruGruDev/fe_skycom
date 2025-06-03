import { ALL_OPTION } from "constants/index";
import { TSelectOption } from "types/SelectOption";
import { TSheetType } from "types/Sheet";
import { SHEET_LABEL, WAREHOUSE_LABEL } from "./label";

export const SHEET_TYPE_VALUE: {
  [key in TSheetType]: string;
} = {
  IP: WAREHOUSE_LABEL.warehouse_import,
  EP: WAREHOUSE_LABEL.warehouse_export,
  TF: WAREHOUSE_LABEL.warehouse_transfer,
  CK: WAREHOUSE_LABEL.warehouse_checked,
};

export const BATCH_INPUT_LABEL: {
  [key in TSheetType]: string;
} = {
  IP: WAREHOUSE_LABEL.batch_system_quantity,
  EP: WAREHOUSE_LABEL.batch_system_quantity,
  TF: WAREHOUSE_LABEL.batch_system_quantity,
  CK: WAREHOUSE_LABEL.batch_system_quantity,
};

export const QUANTITY_INPUT_LABEL: {
  [key in TSheetType]: string;
} = {
  IP: WAREHOUSE_LABEL.import_quantity,
  EP: WAREHOUSE_LABEL.export_quantity,
  TF: WAREHOUSE_LABEL.transfer_quantity,
  CK: WAREHOUSE_LABEL.actual_quantity,
};

export const CHANGE_REASON_FILTER_LABEL: {
  [key in TSheetType]: string;
} = {
  IP: SHEET_LABEL.import_warehouse_reason,
  EP: SHEET_LABEL.export_warehouse_reason,
  TF: SHEET_LABEL.transfer_warehouse_reason,
  CK: SHEET_LABEL.checked_warehouse_reason,
};

export const SHEET_TYPE_OPTIONS: TSelectOption[] = [
  { value: "IP", label: WAREHOUSE_LABEL.warehouse_import },
  { value: "EP", label: WAREHOUSE_LABEL.warehouse_export },
  { value: "TF", label: WAREHOUSE_LABEL.warehouse_transfer },
  { value: "CK", label: WAREHOUSE_LABEL.warehouse_checked },
];

export const CONFIRM_STATUS_OPTIONS: TSelectOption[] = [
  ALL_OPTION,
  { label: SHEET_LABEL.confirmed, value: "true" },
  { label: SHEET_LABEL.not_confirm, value: "false" },
];
