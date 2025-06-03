import { YYYY_MM_DD } from "constants/time";
import {
  HISTORY_WAREHOUSE_COLUMNS,
  HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT,
  HISTORY_WAREHOUSE_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import dayjs from "dayjs";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type HistoryWarehouseContext = {
  history: Partial<TDGrid>;
};

const initParams = {
  limit: 30,
  page: 1,
  created_from: dayjs(new Date()).subtract(90, "day").format(YYYY_MM_DD),
  created_to: dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
  dateValue: 91,
  ordering: "-created",
};

export const useHistoryWarehouseContext = (): HistoryWarehouseContext => {
  const tableProps = useTable({
    columns: HISTORY_WAREHOUSE_COLUMNS,
    columnWidths: HISTORY_WAREHOUSE_COLUMN_WIDTHS,
    columnShowSort: HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT,
    params: initParams,
    storageKey: "HISTORY_WAREHOUSE_TABLE",
  });

  return {
    history: tableProps,
  };
};
