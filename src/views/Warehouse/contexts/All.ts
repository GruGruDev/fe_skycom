import {
  WAREHOUSE_CO,
  WAREHOUSE_COLUMNS,
  WAREHOUSE_COLUMNS_SHOW_SORT,
  WAREHOUSE_COLUMN_WIDTHS,
  WAREHOUSE_HIDDEN_COLUMN_NAMES,
  WAREHOUSE_SIMPLE_CO,
  WAREHOUSE_SIMPLE_COLUMNS,
  WAREHOUSE_SIMPLE_COLUMN_WIDTHS,
  WAREHOUSE_SIMPLE_HIDDEN_COLUMN_NAMES,
} from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import { useState } from "react";
import { TDGrid } from "types/DGrid";
import { TParams } from "types/Param";

export type AllWarehouseContext = {
  all: Partial<TDGrid>;
  allSimple: Partial<TDGrid>;
  setAllWarehouseParams: React.Dispatch<React.SetStateAction<TParams>>;
  allWarehouseParams: TParams;
};

export const useAllWarehouseContext = () => {
  const tableProps = useTable({
    columns: WAREHOUSE_COLUMNS,
    columnWidths: WAREHOUSE_COLUMN_WIDTHS,
    columnOrders: WAREHOUSE_CO,
    hiddenColumnNames: WAREHOUSE_HIDDEN_COLUMN_NAMES,
    columnShowSort: WAREHOUSE_COLUMNS_SHOW_SORT,
    isFullRow: false,
    storageKey: "WAREHOUSE_GROUP_TABLE",
  });

  const simpleTableProps = useTable({
    columns: WAREHOUSE_SIMPLE_COLUMNS,
    columnWidths: WAREHOUSE_SIMPLE_COLUMN_WIDTHS,
    columnOrders: WAREHOUSE_SIMPLE_CO,
    hiddenColumnNames: WAREHOUSE_SIMPLE_HIDDEN_COLUMN_NAMES,
    isFullRow: false,
    storageKey: "WAREHOUSE_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>({ limit: 30, page: 1, ordering: "-created" });

  return {
    all: tableProps,
    allSimple: simpleTableProps,
    allWarehouseParams: params,
    setAllWarehouseParams: setParams,
  };
};
