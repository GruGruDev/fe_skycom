import { FilterChipType } from "components/Table/Header/FilterChip";
import map from "lodash/map";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";
import { formatOptionSelect } from "utils/option";
import { ORDER_LABEL } from "constants/order/label";
import {
  TAG_FILTER,
  CREATED_BY_FILTER,
  DATE_OPTIONS_FILTER_COLORL,
  ORDER_STATUS,
  PRINT_OPTIONS,
  PRINT_STATUS_FILTER,
  CUSTOMER_CARRIER_FILTER,
} from "constants/order";

export const filterChips = ({
  userOptions,
  tagsOptions,
  handleOrderUsers,
  tabName,
}: {
  handleOrderUsers: TUser[];
  tabName?: string;
  tagsOptions: TSelectOption[];
  userOptions: TSelectOption[];
}): FilterChipType[] => [
  { type: "date", dateFilterKeys: DATE_OPTIONS_FILTER_COLORL },
  { type: "select", options: tagsOptions, keysFilter: TAG_FILTER },
  {
    type: "select",
    options: map(handleOrderUsers, formatOptionSelect),
    keysFilter: CREATED_BY_FILTER,
  },
  {
    type: "select",
    options: userOptions,
    keysFilter: CUSTOMER_CARRIER_FILTER,
  },
  {
    type: "select",
    options: ORDER_STATUS,
    keysFilter: {
      label: "status",
      color: "#91f7a4",
      title: ORDER_LABEL.status,
      disabled: tabName === "all" ? false : true,
    },
  },
  {
    type: "select",
    options: PRINT_OPTIONS,
    keysFilter: PRINT_STATUS_FILTER,
    mode: "single",
  },
];
