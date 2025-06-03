import {
  VARIANT_COLUMNS,
  VARIANT_COLUMN_WIDTHS,
  VARIANT_SORT_COLUMNS,
} from "constants/product/variant";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type AllVariantContext = {
  tabAllVariant: Partial<TDGrid>;
};

export const useAllVariantContext = (): AllVariantContext => {
  const tableVariant = useTable({
    columns: VARIANT_COLUMNS,
    columnWidths: VARIANT_COLUMN_WIDTHS,
    columnShowSort: VARIANT_SORT_COLUMNS,
    params: { limit: 30, page: 1, ordering: "-created" },
    storageKey: "ALL_VARIANT_GROUP_TABLE",
  });

  return {
    tabAllVariant: tableVariant,
  };
};
