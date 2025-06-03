import { ALL_OPTION } from "constants/index";
import { TSelectOption } from "types/SelectOption";
import { USER_ACTIVE_LABEL } from "types/User";
import { USER_LABEL } from "./label";

export const IS_ACTIVE_OPTIONS = [
  { label: USER_LABEL[USER_ACTIVE_LABEL.active], value: "true", color: "success" },
  { label: USER_LABEL[USER_ACTIVE_LABEL.inactive], value: "false", color: "info" },
];

export const STATUS_OPTIONS: TSelectOption[] = [
  ALL_OPTION,
  { label: USER_LABEL[USER_ACTIVE_LABEL.active], value: "true" },
  { label: USER_LABEL[USER_ACTIVE_LABEL.inactive], value: "false" },
];
