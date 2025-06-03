import {
  HISTORY_DETAIL_HIDDEN_COLUMN_NAMES,
  HISTORY_WAREHOUSE_COLUMNS,
  HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT,
  HISTORY_WAREHOUSE_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type LogsContext = {
  logs: Partial<TDGrid>;
};

export const useLogsContext = (): LogsContext => {
  const tableProps = useTable({
    columns: HISTORY_WAREHOUSE_COLUMNS,
    columnWidths: HISTORY_WAREHOUSE_COLUMN_WIDTHS,
    columnShowSort: HISTORY_WAREHOUSE_COLUMNS_SHOW_SORT,
    hiddenColumnNames: HISTORY_DETAIL_HIDDEN_COLUMN_NAMES,
    params: { limit: 100, page: 1, ordering: "-created" },
  });

  return {
    logs: tableProps,
  };
};
