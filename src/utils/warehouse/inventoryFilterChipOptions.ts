import { FilterChipType } from "components/Table/Header/FilterChip";
import { ALL_OPTION } from "constants/index";
import { LABEL } from "constants/label";
import { SHEET_LABEL } from "constants/warehouse/label";
import { TDateFilter } from "types/Filter";
import { TSelectOption } from "types/SelectOption";

export interface SheetChipType {
  warehouseOptions: TSelectOption[];
}

export const inventoryFilterChipOptions = ({
  warehouseOptions,
}: SheetChipType): FilterChipType[] | undefined => [
  { type: "date", dateFilterKeys: CREATED_FILTER_COLOR },
  {
    type: "select",
    options: [ALL_OPTION, ...warehouseOptions],
    keysFilter: { label: "warehouse_id", title: SHEET_LABEL.warehouse },
  },
];

const CREATED_FILTER_COLOR: TDateFilter[] = [
  {
    title: LABEL.CREATED,
    keyFilters: [
      { label: "date_from", color: "#91f7d3", title: LABEL.CREATED_FROM },
      { label: "date_to", color: "#91f7d3", title: LABEL.CREATED_TO },
      { label: "dateValue" },
    ],
  },
];
