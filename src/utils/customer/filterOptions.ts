import { GENDER_OPTIONS } from "constants/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { ALL_OPTION, INIT_ATTRIBUTE_OPTIONS } from "constants/index";
import { TCustomer } from "types/Customer";
import { TFilterProps } from "types/DGrid";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { compareDateSelected } from "utils/date";
import { revertFromQueryForSelector } from "utils/param";

const FILTER_GENDER_OPTIONS: TSelectOption[] = [ALL_OPTION, ...GENDER_OPTIONS];
const selectorStyle = { width: 180, marginTop: 4 };

export const filterOptions = ({
  handleCustomerUsers,
  tags,
  groups,
  ranks,
  params,
  onSetParams,
  setParams,
}: {
  handleCustomerUsers: TSelectOption[];
  tags: TSelectOption[];
  ranks: TSelectOption[];
  groups: TSelectOption[];
  params: TParams;
  onSetParams: (
    name: keyof TCustomer,
    value: string | number | "all" | "none" | (string | number)[],
  ) => void;
  setParams: (params: TParams) => void;
}): TFilterProps[] => {
  const dateParams = params as { [key: string]: string | undefined };

  return [
    {
      key: "gender",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("gender", value),
        options: FILTER_GENDER_OPTIONS,
        title: CUSTOMER_LABEL.gender,
        value: revertFromQueryForSelector(params?.gender),
        style: selectorStyle,
        selectorId: "gender",
      },
    },
    {
      key: "created_by",
      type: "select",
      multiSelectProps: {
        selectorId: "create-by",
        title: CUSTOMER_LABEL.created_by,
        style: selectorStyle,
        options: [...INIT_ATTRIBUTE_OPTIONS, ...handleCustomerUsers],
        onChange: (value) => onSetParams("created_by", value),
        value: revertFromQueryForSelector(params?.created_by),
      },
    },
    {
      key: "customer_care_staff",
      type: "select",
      multiSelectProps: {
        selectorId: "customer_care_staff",
        title: CUSTOMER_LABEL.customer_care_staff,
        style: selectorStyle,
        options: [...INIT_ATTRIBUTE_OPTIONS, ...handleCustomerUsers],
        onChange: (value) => onSetParams("customer_care_staff", value),
        value: revertFromQueryForSelector(params?.customer_care_staff),
      },
    },
    {
      key: "rank",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("rank", value),
        options: [ALL_OPTION, ...ranks],
        title: CUSTOMER_LABEL.rank,
        value: revertFromQueryForSelector(params?.rank),
        style: selectorStyle,
        selectorId: "rank",
      },
    },
    {
      key: "groups",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("groups", value),
        options: [ALL_OPTION, ...groups],
        title: CUSTOMER_LABEL.groups,
        value: revertFromQueryForSelector(params?.groups),
        style: selectorStyle,
        selectorId: "groups",
      },
    },
    {
      key: "tags",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("tags", value),
        options: [ALL_OPTION, ...tags],
        title: CUSTOMER_LABEL.tags,
        value: revertFromQueryForSelector(params?.tags),
        style: selectorStyle,
        selectorId: "tags",
      },
    },
    {
      type: "time",
      timeProps: {
        label: CUSTOMER_LABEL.birthday,
        handleSubmit: (from: string, to: string, value: string | number) => {
          const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);

          setParams?.({
            ...dateParams,
            birthday_from: date_from,
            birthday_to: date_to,
            birthdayValue: toValue,
          });
        },
        defaultDateValue: dateParams?.birthdayValue,
        created_from: dateParams?.birthday_from,
        created_to: dateParams?.birthday_to,
        size: "small",
        standard: true,
      },
    },
    {
      type: "time",
      timeProps: {
        label: CUSTOMER_LABEL.created,
        handleSubmit: (from: string, to: string, value: string | number) => {
          const { date_from, date_to, value: createdValue } = compareDateSelected(from, to, value);

          setParams({
            ...dateParams,
            created_from: date_from,
            created_to: date_to,
            createdValue: createdValue,
          });
        },
        defaultDateValue: dateParams?.createdValue,
        created_from: dateParams?.created_from,
        created_to: dateParams?.created_to,
        size: "small",
        standard: true,
      },
    },
    {
      type: "time",
      timeProps: {
        label: CUSTOMER_LABEL.last_order_time,
        handleSubmit: (from: string, to: string, value: string | number) => {
          const {
            date_from,
            date_to,
            value: lastOrderTimeValue,
          } = compareDateSelected(from, to, value);

          setParams({
            ...dateParams,
            last_order_time_from: date_from,
            last_order_time_to: date_to,
            dateValue: lastOrderTimeValue,
          });
        },
        defaultDateValue: dateParams?.lastOrderTimeValue,
        created_from: dateParams?.last_order_time_from,
        created_to: dateParams?.last_order_time_to,
        size: "small",
        standard: true,
      },
    },
  ];
};
