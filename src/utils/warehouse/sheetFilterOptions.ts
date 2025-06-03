import { ALL_OPTION } from "constants/index";
import {
  CHANGE_REASON_FILTER_LABEL,
  SHEET_TYPE_OPTIONS,
  CONFIRM_STATUS_OPTIONS,
} from "constants/warehouse";
import {
  INVENTORY_LOG_LABEL,
  SCAN_CODE_LABEL,
  SHEET_LABEL,
  WAREHOUSE_LABEL,
} from "constants/warehouse/label";
import map from "lodash/map";
import { TAttribute } from "types/Attribute";
import { TFilterProps } from "types/DGrid";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { TSheet, TSheetFilterProps, TSheetType } from "types/Sheet";
import { TUser } from "types/User";
import { compareDateSelected } from "utils/date";
import { formatOptionSelect } from "utils/option";
import { revertFromQueryForSelector } from "utils/param";

const selectorStyle: React.CSSProperties = { width: 180 };

export interface SheetFilterOptionType extends TSheetFilterProps {
  params?: TParams;
  setParams?: (params: TParams) => void;
  onSetParams: (
    name: keyof TSheet,
    value: string | number | "all" | "none" | (string | number)[],
  ) => void;
  users: TUser[];
  inventoryReasonOptions?: TAttribute[];
  warehouseOptions: TSelectOption[];
  productCategoryOptions: TSelectOption[];
  type?: TSheetType;
}

export const sheetFilterOptions = ({
  params,
  setParams,
  onSetParams,
  users,
  type,
  inventoryReasonOptions,
  warehouseOptions,
  isFilterCreator,
  isFilterCreatedDate,
  isFilterConfimer,
  isFilterProductCategory,
  productCategoryOptions,
  isFilterConfirmDate,
  isFilterStatus, // confirm
  isFilterChangeReason,
  isFilterWarehouse,
  isFilterWarehouseFrom,
  isFilterWarehouseTo,
  isFilterSheetType,
  //scan history
  isFillterScanBy,
  isFillterScanAt,
}: SheetFilterOptionType): TFilterProps[] => {
  const dateParams = { ...params } as { [key: string]: string | undefined };

  return [
    isFilterCreator
      ? {
          key: "created_by",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: INVENTORY_LOG_LABEL.created_by,
            options: [ALL_OPTION, ...map(users, formatOptionSelect)],
            onChange: (value) => onSetParams("created_by", value),
            value: revertFromQueryForSelector(params?.created_by),
            selectorId: "create-by",
          },
        }
      : null,
    isFilterConfimer
      ? {
          key: "confirm_by",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SHEET_LABEL.confirm_by,
            options: [ALL_OPTION, ...map(users, formatOptionSelect)],
            onChange: (value) => onSetParams("confirm_by", value),
            value: revertFromQueryForSelector(params?.confirm_by),
            selectorId: "confirm-by",
          },
        }
      : null,
    isFilterSheetType
      ? {
          key: "type",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SHEET_LABEL.type,
            options: [ALL_OPTION, ...SHEET_TYPE_OPTIONS],
            onChange: (value) => onSetParams("type", value),
            value: revertFromQueryForSelector(params?.type),
            selectorId: "sheet-type",
          },
        }
      : null,
    isFilterStatus
      ? {
          key: "is_confirm",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SHEET_LABEL.status,
            options: CONFIRM_STATUS_OPTIONS,
            onChange: (value) => onSetParams("is_confirm", value),
            value: revertFromQueryForSelector(params?.is_confirm),
            selectorId: "is-confirm",
          },
        }
      : null,
    isFilterChangeReason
      ? {
          key: "change_reason",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: type && CHANGE_REASON_FILTER_LABEL[type],
            options: [ALL_OPTION, ...map(inventoryReasonOptions, formatOptionSelect)],
            onChange: (value) => onSetParams("change_reason", value),
            value: revertFromQueryForSelector(params?.change_reason),
            selectorId: "change-reason",
          },
        }
      : null,
    isFilterWarehouse
      ? {
          key: "warehouse",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SHEET_LABEL.warehouse,
            options: [ALL_OPTION, ...warehouseOptions],
            onChange: (value) => onSetParams("warehouse", value),
            value: revertFromQueryForSelector(params?.warehouse),
            selectorId: "warehouse",
          },
        }
      : null,
    isFilterWarehouseFrom
      ? {
          key: "warehouse_from",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SHEET_LABEL.warehouse_from,
            options: [ALL_OPTION, ...warehouseOptions],
            onChange: (value) => onSetParams("warehouse_from", value),
            value: revertFromQueryForSelector(params?.warehouse_from),
            selectorId: "warehouse-from",
          },
        }
      : null,
    isFilterWarehouseTo
      ? {
          key: "warehouse_to",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SHEET_LABEL.warehouse_to,
            options: [ALL_OPTION, ...warehouseOptions],
            onChange: (value) => onSetParams("warehouse_to", value),
            value: revertFromQueryForSelector(params?.warehouse_to),
            selectorId: "warehouse-to",
          },
        }
      : null,
    isFilterProductCategory
      ? {
          key: "category",
          type: "select",
          multiSelectProps: {
            simpleSelect: true,
            style: selectorStyle,
            title: SHEET_LABEL.category,
            options: [ALL_OPTION, ...productCategoryOptions],
            onChange: (value) => onSetParams("category", value),
            value: revertFromQueryForSelector(params?.category),
            selectorId: "category",
          },
        }
      : null,
    isFilterCreatedDate
      ? {
          type: "time",
          timeProps: {
            label: WAREHOUSE_LABEL.created,
            standard: true,
            size: "small",
            created_from: dateParams?.created_from,
            created_to: dateParams?.created_to,
            handleSubmit: (
              created_from: string,
              created_to: string,
              dateValue: string | number,
            ) => {
              const {
                date_from,
                date_to,
                value: toValue,
              } = compareDateSelected(created_from, created_to, dateValue);
              setParams?.({
                ...params,
                created_from: date_from,
                created_to: date_to,
                dateValue: toValue,
              });
            },
            defaultDateValue: dateParams?.dateValue,
          },
        }
      : null,
    isFilterConfirmDate
      ? {
          type: "time",
          timeProps: {
            label: SHEET_LABEL.confirm_date,
            standard: true,
            size: "small",
            created_from: dateParams?.confirm_date_from,
            created_to: dateParams?.confirm_date_to,
            handleSubmit: (
              created_from: string,
              created_to: string,
              dateValue: string | number,
            ) => {
              const {
                date_from,
                date_to,
                value: toValue,
              } = compareDateSelected(created_from, created_to, dateValue);
              setParams?.({
                ...params,
                confirm_date_from: date_from,
                confirm_date_to: date_to,
                confirmDate: toValue,
              });
            },
            defaultDateValue: dateParams?.confirmDate,
          },
        }
      : null,
    isFillterScanBy
      ? {
          key: "scan_by",
          type: "select",
          multiSelectProps: {
            style: selectorStyle,
            title: SCAN_CODE_LABEL.scan_by,
            options: [ALL_OPTION, ...map(users, formatOptionSelect)],
            onChange: (value) => onSetParams("scan_by", value),
            value: revertFromQueryForSelector(params?.scan_by),
            selectorId: "scan_by",
          },
        }
      : null,
    isFillterScanAt
      ? {
          type: "time",
          timeProps: {
            label: SCAN_CODE_LABEL.scan_at,
            standard: true,
            size: "small",
            created_from: dateParams?.scan_at_from,
            created_to: dateParams?.scan_at_to,
            handleSubmit: (
              created_from: string,
              created_to: string,
              dateValue: string | number,
            ) => {
              const {
                date_from,
                date_to,
                value: toValue,
              } = compareDateSelected(created_from, created_to, dateValue);
              setParams?.({
                ...params,
                scan_at_from: date_from,
                scan_at_to: date_to,
                dateValue: toValue,
              });
            },
            defaultDateValue: dateParams?.dateValue,
          },
        }
      : null,
  ];
};
