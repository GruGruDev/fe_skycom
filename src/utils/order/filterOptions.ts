import { ALL_OPTION, FULL_OPTIONS } from "constants/index";
import { ORDER_STATUS } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import map from "lodash/map";
import { TFilterProps } from "types/DGrid";
import { TOrderFilterProps } from "types/Order";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";
import { compareDateSelected } from "utils/date";
import { formatOptionSelect } from "utils/option";
import { revertFromQueryForSelector } from "utils/param";

export const filterOptions = ({
  handleOrderUsers,
  tagsOptions,
  userOptions,
  ...props
}: TOrderFilterProps & {
  handleOrderUsers: TUser[];
  tagsOptions: TSelectOption[];
  userOptions: TSelectOption[];
}): TFilterProps[] => {
  const dateParams = { ...props.params } as { [key: string]: string | undefined };
  return [
    props.isFilterOrderStatus
      ? {
          key: "status",
          type: "select",
          multiSelectProps: {
            onChange: (value) => props.setParams?.({ ...props.params, page: 1, status: value }),
            options: [...FULL_OPTIONS, ...ORDER_STATUS],
            title: ORDER_LABEL.status,
            value: revertFromQueryForSelector(props.params?.status),
            style: selectorStyle,
            selectorId: "status-order",
          },
        }
      : null,
    props.isFilterModifiedBy
      ? {
          key: "modified_by",
          type: "select",
          multiSelectProps: {
            onChange: (value) =>
              props.setParams?.({ ...props.params, page: 1, modified_by: value }),
            options: [...FULL_OPTIONS, ...map(handleOrderUsers, formatOptionSelect)],
            title: ORDER_LABEL.modified_by,
            value: revertFromQueryForSelector(props.params?.modified_by),
            style: selectorStyle,
            selectorId: "handle-by",
          },
        }
      : null,
    props.isFilterCreator
      ? {
          key: "created_by",
          type: "select",
          multiSelectProps: {
            onChange: (value) => props.setParams?.({ ...props.params, page: 1, created_by: value }),
            options: [ALL_OPTION, ...map(handleOrderUsers, formatOptionSelect)],
            title: ORDER_LABEL.created_by,
            value: revertFromQueryForSelector(props.params?.created_by),
            style: selectorStyle,
            selectorId: "create-by",
          },
        }
      : null,
    props.isFilterCustomerCarrier
      ? {
          key: "customer_care_staff",
          type: "select",
          multiSelectProps: {
            onChange: (value) =>
              props.setParams?.({ ...props.params, page: 1, customer_care_staff_id: value }),
            options: [ALL_OPTION, ...userOptions],
            title: ORDER_LABEL.customer_care_staff,
            value: revertFromQueryForSelector(props.params?.customer_care_staff_id),
            style: selectorStyle,
            selectorId: "customer_care_staff",
          },
        }
      : null,
    props.isFilterTag
      ? {
          type: "select",
          multiSelectProps: {
            onChange: (value) => props.setParams?.({ ...props.params, page: 1, tags: value }),
            options: [...FULL_OPTIONS, ...tagsOptions],
            title: ORDER_LABEL.tags,
            value: revertFromQueryForSelector(props.params?.tags),
            style: selectorStyle,
            selectorId: "tags",
          },
        }
      : null,
    props.isFilterPrinted
      ? {
          key: "printed_status",
          type: "select",
          multiSelectProps: {
            onChange: (value) => props.setParams?.({ ...props.params, page: 1, is_print: value }),
            options: [
              ALL_OPTION,
              { label: ORDER_LABEL.printed, value: "true" },
              { label: ORDER_LABEL.not_printed, value: "false" },
            ],
            title: ORDER_LABEL.print_status,
            value: revertFromQueryForSelector(props.params?.is_print),
            style: selectorStyle,
            simpleSelect: true,
            selectorId: "print-status",
          },
        }
      : null,
    props.isFilterDate
      ? {
          type: "time",
          timeProps: {
            label: ORDER_LABEL.create_order,
            handleSubmit: (from: string, to: string, value: string | number) => {
              const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);

              props.setParams?.({
                ...dateParams,
                created_from: date_from,
                created_to: date_to,
                dateValue: toValue,
              });
            },
            defaultDateValue: dateParams?.dateValue,
            created_from: dateParams?.created_from,
            created_to: dateParams?.created_to,
            size: "small",
            standard: true,
          },
        }
      : null,
    props.isFilterConfirmDate
      ? {
          type: "time",
          timeProps: {
            label: ORDER_LABEL.complete_time,
            handleSubmit: (from: string, to: string, value: string | number) => {
              const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);

              props.setParams?.({
                ...dateParams,
                completed_from: date_from,
                completed_to: date_to,
                confirmDateValue: toValue,
              });
            },
            defaultDateValue: dateParams?.confirmDateValue,
            created_from: dateParams?.completed_from,
            created_to: dateParams?.completed_to,
            size: "small",
            standard: true,
          },
        }
      : null,
  ];
};

const selectorStyle = { width: 180, marginTop: 4 };
