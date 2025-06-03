import { YYYY_MM_DD } from "constants/time";
import {
  IMPORT_EXPORT_SHEET_HIDDEN_COLUMN_NAMES,
  SHEET_COLUMNS,
  SHEET_COLUMNS_SHOW_SORT,
  SHEET_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import dayjs from "dayjs";
import useTable from "hooks/useTable";
import { useMemo } from "react";
import { TDGrid } from "types/DGrid";

export type ImportSheetContext = {
  import: Partial<TDGrid>;
};

const initParams = {
  limit: 30,
  page: 1,
  created_from: dayjs(new Date()).subtract(90, "day").format(YYYY_MM_DD),
  created_to: dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
  dateValue: 91,
  ordering: "-created",
};

export const useImportSheetContext = (): ImportSheetContext => {
  const tableProps = useTable({
    columns: SHEET_COLUMNS,
    columnWidths: SHEET_COLUMN_WIDTHS,
    columnShowSort: SHEET_COLUMNS_SHOW_SORT,
    hiddenColumnNames: IMPORT_EXPORT_SHEET_HIDDEN_COLUMN_NAMES,
    params: initParams,
    storageKey: "IMPORT_SHEET_TABLE",
  });

  const cacheParams = useMemo(() => ({ ...tableProps.params, type: ["IP"] }), [tableProps.params]);

  return {
    import: { ...tableProps, params: cacheParams },
  };
};
