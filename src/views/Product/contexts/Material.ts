import {
  MATERIAL_COLUMNS,
  MATERIAL_COLUMN_WIDTHS,
  MATERIAL_SIMPLE_COLUMNS,
  MATERIAL_SIMPLE_COLUMN_WIDTHS,
} from "constants/product/material";
import useTable from "hooks/useTable";
import { Dispatch, SetStateAction, useState } from "react";
import { TDGrid } from "types/DGrid";
import { TParams } from "types/Param";

export type MaterialContext = {
  material: Partial<TDGrid>;
  materialSimple: Partial<TDGrid>;
  materialParams: TParams;
  setMaterialParams: React.Dispatch<React.SetStateAction<TParams>>;
  tabMSimpleMaterial: {
    params: TParams;
    setParams: Dispatch<SetStateAction<TParams>>;
  };
};

export const useMaterialContext = (): MaterialContext => {
  const tableMaterial = useTable({
    columns: MATERIAL_COLUMNS,
    columnWidths: MATERIAL_COLUMN_WIDTHS,
    storageKey: "MATERIAL_GROUP_TABLE",
  });

  const simpleTableMaterial = useTable({
    columns: MATERIAL_SIMPLE_COLUMNS,
    columnWidths: MATERIAL_SIMPLE_COLUMN_WIDTHS,
    storageKey: "MATERIAL_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>({
    limit: 30,
    page: 1,
    ordering: "-created",
  });

  const tabMSimpleMaterial = useState<TParams>({
    limit: 30,
    page: 1,
    ordering: "-created",
  });

  return {
    material: tableMaterial,
    materialSimple: simpleTableMaterial,
    materialParams: params,
    setMaterialParams: setParams,
    tabMSimpleMaterial: { params: tabMSimpleMaterial[0], setParams: tabMSimpleMaterial[1] },
  };
};
