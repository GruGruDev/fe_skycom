import { PRODUCT_COLUMNS, PRODUCT_COLUMN_WIDTHS } from "constants/product/columns";
import useTable from "hooks/useTable";
import { Dispatch, SetStateAction, useState } from "react";
import { TDGrid } from "types/DGrid";
import { TParams } from "types/Param";
import { VARIANT_TYPE } from "types/Product";

export type SimpleProductContext = {
  simpleProduct: Partial<TDGrid>;
  tabMSimpleProduct: {
    params: TParams;
    setParams: Dispatch<SetStateAction<TParams>>;
  };
};

export const useSimpleProductContext = (): SimpleProductContext => {
  const tableProduct = useTable({
    columns: PRODUCT_COLUMNS,
    columnWidths: PRODUCT_COLUMN_WIDTHS,
    params: { limit: 30, page: 1, ordering: "-created", type: VARIANT_TYPE.SIMPLE },
    storageKey: "PRODUCT_SIMPLE_TABLE",
  });

  const tabMSimpleProduct = useState<TParams>({
    limit: 15,
    page: 1,
    ordering: "-created",
    type: VARIANT_TYPE.SIMPLE,
  });

  return {
    simpleProduct: tableProduct,
    tabMSimpleProduct: { params: tabMSimpleProduct[0], setParams: tabMSimpleProduct[1] },
  };
};
