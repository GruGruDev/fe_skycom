import { HISTORY_SCAN_COLUMNS, HISTORY_SCAN_COLUMNS_WIDTHS } from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type HistoryScanContext = {
  history_scan: Partial<TDGrid>;
};

const initParams = {
  limit: 30,
  page: 1,
  ordering: "-turn_number",
};

export const useHistoryScanContext = (): HistoryScanContext => {
  const tableProps = useTable({
    columns: HISTORY_SCAN_COLUMNS,
    columnWidths: HISTORY_SCAN_COLUMNS_WIDTHS,
    params: initParams,
    storageKey: "SCAN_HISTORY_TABLE",
  });

  return {
    history_scan: tableProps,
  };
};
