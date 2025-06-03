import {
  INVENTORY_COLUMNS,
  INVENTORY_COLUMNS_SHOW_SORT,
  INVENTORY_COLUMNS_WIDTHS,
} from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type InventoryContext = {
  inventory: Partial<TDGrid>;
};

export const useInventoryContext = (): InventoryContext => {
  const tableProps = useTable({
    columns: INVENTORY_COLUMNS,
    columnWidths: INVENTORY_COLUMNS_WIDTHS,
    columnShowSort: INVENTORY_COLUMNS_SHOW_SORT,
    params: { limit: 30, page: 1, ordering: "-created" },
  });

  return {
    inventory: tableProps,
  };
};
