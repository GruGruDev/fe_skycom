import { COMBO_COLUMNS, COMBO_COLUMN_WIDTHS } from "constants/product/combo";
import useResponsive from "hooks/useResponsive";
import useTable from "hooks/useTable";
import { TDGrid } from "types/DGrid";

export type AllProductContext = {
  tabAllProduct: Partial<TDGrid>;
};

export const useAllProductContext = (): AllProductContext => {
  const isDesktop = useResponsive("up", "sm");

  const tableProduct = useTable({
    columns: COMBO_COLUMNS,
    columnWidths: COMBO_COLUMN_WIDTHS,
    params: { limit: isDesktop ? 30 : 10, page: 1, ordering: "-created" },
    storageKey: "ALL_PRODUCT_GROUP_TABLE",
  });

  return {
    tabAllProduct: tableProduct,
  };
};
