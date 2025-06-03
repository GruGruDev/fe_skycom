import { COMBO_SIMPLE_COLUMN_WIDTHS, COMBO_SIMPLE_COLUMNS } from "constants/product/combo";
import {
  VARIANT_COLUMN_WIDTHS,
  VARIANT_COLUMNS,
  VARIANT_SORT_COLUMNS,
} from "constants/product/variant";
import useTable from "hooks/useTable";
import { Dispatch, SetStateAction, useState } from "react";
import { TDGrid } from "types/DGrid";
import { TParams } from "types/Param";
import { VARIANT_TYPE } from "types/Product";

export type ComboProductContext = {
  combo: {
    comboVariant: Partial<TDGrid>;
    variantSimpleTable: Partial<TDGrid>;
    params: TParams;
    setParams: Dispatch<SetStateAction<TParams>>;
  };
};

export const useComboProductContext = (): ComboProductContext => {
  const tableVariant = useTable({
    columns: VARIANT_COLUMNS,
    columnWidths: VARIANT_COLUMN_WIDTHS,
    columnShowSort: VARIANT_SORT_COLUMNS,
    storageKey: "COMBO_PRODUCT_GROUP_TABLE",
  });

  const variantSimpleTable = useTable({
    columns: COMBO_SIMPLE_COLUMNS,
    columnWidths: COMBO_SIMPLE_COLUMN_WIDTHS,
    storageKey: "COMBO_PRODUCT_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>({
    limit: 30,
    page: 1,
    ordering: "-created",
    type: VARIANT_TYPE.COMBO,
  });

  return {
    combo: { comboVariant: tableVariant, variantSimpleTable, params, setParams },
  };
};
