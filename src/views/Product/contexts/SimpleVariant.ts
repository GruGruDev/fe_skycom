import {
  VARIANT_COLUMNS,
  VARIANT_COLUMN_WIDTHS,
  VARIANT_SIMPLE_COLUMNS,
  VARIANT_SIMPLE_COLUMN_WIDTHS,
  VARIANT_SORT_COLUMNS,
} from "constants/product/variant";
import useTable from "hooks/useTable";
import { Dispatch, SetStateAction, useState } from "react";
import { TDGrid } from "types/DGrid";
import { TParams } from "types/Param";
import { VARIANT_TYPE } from "types/Product";

export type SimpleVariantContext = {
  simpleVariant: Partial<TDGrid>;
  simpleVariantSimple: Partial<TDGrid>;
  variantParams: TParams;
  setVariantParams: React.Dispatch<React.SetStateAction<TParams>>;
  tabMSimpleVariant: {
    params: TParams;
    setParams: Dispatch<SetStateAction<TParams>>;
  };
};

export const useSimpleVariantContext = (): SimpleVariantContext => {
  const tableVariant = useTable({
    columns: VARIANT_COLUMNS,
    columnWidths: VARIANT_COLUMN_WIDTHS,
    columnShowSort: VARIANT_SORT_COLUMNS,
    storageKey: "VARIANT_GROUP_TABLE",
  });

  const simpleTableVariant = useTable({
    columns: VARIANT_SIMPLE_COLUMNS,
    columnWidths: VARIANT_SIMPLE_COLUMN_WIDTHS,
    storageKey: "VARIANT_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>({
    limit: 30,
    page: 1,
    ordering: "-created",
    type: VARIANT_TYPE.SIMPLE,
  });

  const tabMSimpleVariant = useState<TParams>({
    limit: 30,
    page: 1,
    ordering: "-created",
    type: VARIANT_TYPE.SIMPLE,
  });

  return {
    simpleVariant: tableVariant,
    simpleVariantSimple: simpleTableVariant,
    variantParams: params,
    setVariantParams: setParams,
    tabMSimpleVariant: { params: tabMSimpleVariant[0], setParams: tabMSimpleVariant[1] },
  };
};
