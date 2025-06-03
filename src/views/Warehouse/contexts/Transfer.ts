import { YYYY_MM_DD } from "constants/time";
import {
  SHEET_COLUMNS,
  SHEET_COLUMNS_SHOW_SORT,
  SHEET_COLUMN_WIDTHS,
  TRANSFER_SHEET_HIDDEN_COLUMN_NAMES,
} from "constants/warehouse/columns";
import dayjs from "dayjs";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type TransferSheetContext = {
  transfer: Partial<TDGrid>;
};

const initParams = {
  limit: 30,
  page: 1,
  created_from: dayjs(new Date()).subtract(90, "day").format(YYYY_MM_DD),
  created_to: dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
  dateValue: 91,
  ordering: "-created",
};

export const useTransferSheetContext = (): TransferSheetContext => {
  const tableProps = useTable({
    columns: SHEET_COLUMNS,
    columnWidths: SHEET_COLUMN_WIDTHS,
    columnShowSort: SHEET_COLUMNS_SHOW_SORT,
    hiddenColumnNames: TRANSFER_SHEET_HIDDEN_COLUMN_NAMES,
    params: initParams,
    storageKey: "TRANSFER_SHEET_TABLE",
  });

  return {
    transfer: tableProps,
  };
};
