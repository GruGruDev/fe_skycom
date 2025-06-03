import { FilterChipType } from "components/Table/Header/FilterChip";
import { GENDER_OPTIONS } from "constants/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { ALL_OPTION, INIT_ATTRIBUTE_OPTIONS } from "constants/index";
import { TDateFilter } from "types/Filter";
import { TSelectOption } from "types/SelectOption";

const FILTER_GENDER_OPTIONS: TSelectOption[] = [ALL_OPTION, ...GENDER_OPTIONS];

export const DATE_OPTIONS_FILTER_COLORL: TDateFilter[] = [
  {
    title: CUSTOMER_LABEL.created,
    keyFilters: [
      { label: "created_from", color: "#91f7a4", title: CUSTOMER_LABEL.created_from },
      { label: "created_to", color: "#91f7a4", title: CUSTOMER_LABEL.created_to },
      { label: "createdValue" },
    ],
  },
  {
    title: CUSTOMER_LABEL.birthday,
    keyFilters: [
      { label: "birthday_from", color: "#91f7a4", title: CUSTOMER_LABEL.birthday_from },
      { label: "birthday_to", color: "#91f7a4", title: CUSTOMER_LABEL.birthday_to },
      { label: "birthdayValue" },
    ],
  },
  {
    title: CUSTOMER_LABEL.last_order_time,
    keyFilters: [
      {
        label: "last_order_time_from",
        color: "#91f7a4",
        title: CUSTOMER_LABEL.last_order_time_from,
      },
      { label: "last_order_time_to", color: "#91f7a4", title: CUSTOMER_LABEL.last_order_time_to },
      { label: "lastOrderTimeValue" },
    ],
  },
];

export const filterChips = ({
  tags,
  ranks,
  groups,
  handleCustomerUsers,
}: {
  tags: TSelectOption[];
  ranks: TSelectOption[];
  groups: TSelectOption[];
  handleCustomerUsers: TSelectOption[];
}): FilterChipType[] => [
  { type: "date", dateFilterKeys: DATE_OPTIONS_FILTER_COLORL },
  {
    type: "select",
    options: FILTER_GENDER_OPTIONS,
    keysFilter: { label: "gender", title: CUSTOMER_LABEL.gender },
  },
  {
    type: "select",
    options: [...INIT_ATTRIBUTE_OPTIONS, ...ranks],
    keysFilter: { label: "rank", title: CUSTOMER_LABEL.rank },
  },
  {
    type: "select",
    options: [...INIT_ATTRIBUTE_OPTIONS, ...handleCustomerUsers],
    keysFilter: { label: "created_by", title: CUSTOMER_LABEL.created_by },
  },
  {
    type: "select",
    options: [...INIT_ATTRIBUTE_OPTIONS, ...handleCustomerUsers],
    keysFilter: { label: "customer_care_staff", title: CUSTOMER_LABEL.customer_care_staff },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...groups],
    keysFilter: { label: "groups", title: CUSTOMER_LABEL.groups },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...tags],
    keysFilter: { label: "tags", title: CUSTOMER_LABEL.tags },
  },
];
