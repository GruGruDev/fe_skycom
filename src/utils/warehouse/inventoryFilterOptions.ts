import { ALL_OPTION } from "constants/index";
import { SHEET_LABEL, WAREHOUSE_LABEL } from "constants/warehouse/label";
import { TFilterProps } from "types/DGrid";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { TSheetType } from "types/Sheet";
import { compareDateSelected } from "utils/date";
import { revertFromQueryForSelector } from "utils/param";

const selectorStyle: React.CSSProperties = { width: 180 };

export interface SheetFilterOptionType {
  params?: TParams;
  setParams?: (params: TParams) => void;
  warehouseOptions: TSelectOption[];
  type?: TSheetType;
}

export const inventoryFilterOptions = ({
  params,
  setParams,
  warehouseOptions,
}: SheetFilterOptionType): TFilterProps[] => {
  const dateParams = { ...params } as { [key: string]: string | undefined };

  return [
    {
      key: "warehouse",
      type: "select",
      multiSelectProps: {
        style: selectorStyle,
        title: SHEET_LABEL.warehouse,
        options: [ALL_OPTION, ...warehouseOptions],
        onChange: (value) => setParams?.({ ...params, warehouse_id: value }),
        value: revertFromQueryForSelector(params?.warehouse_id),
        selectorId: "warehouse",
      },
    },
    {
      type: "time",
      timeProps: {
        label: WAREHOUSE_LABEL.date,
        standard: true,
        size: "small",
        created_from: dateParams?.date_from,
        created_to: dateParams?.date_to,
        handleSubmit: (modified_from: string, modified_to: string, dateValue: string | number) => {
          const {
            date_from,
            date_to,
            value: toValue,
          } = compareDateSelected(modified_from, modified_to, dateValue);
          setParams?.({ ...params, date_from, date_to, dateValue: toValue });
        },
        defaultDateValue: dateParams?.dateValue,
      },
    },
  ];
};
