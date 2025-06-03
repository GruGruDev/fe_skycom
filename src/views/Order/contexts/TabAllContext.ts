import {
  ORDER_COLUMNS,
  ORDER_COLUMN_WIDTHS,
  ORDER_SIMPLE_COLUMNS,
  ORDER_SIMPLE_COLUMN_WIDTHS,
  ORDER_SORT_COLUMNS,
} from "constants/order/columns";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import useTable from "hooks/useTable";
import { useMemo, useState } from "react";
import { TDGrid } from "types/DGrid";
import { TParams } from "types/Param";
import { checkPermission } from "utils/roleUtils";

const initParams = {
  limit: 30,
  page: 1,
  ordering: "-created",
};

export type AllContext = {
  all: Partial<TDGrid>;
  allSimple: Partial<TDGrid>;
  allParams: TParams;
  setAllParams: React.Dispatch<React.SetStateAction<TParams>>;
};

export const useAllContext = (): Partial<AllContext> => {
  const { user } = useAuth();

  const tableProps = useTable({
    columns: ORDER_COLUMNS,
    columnWidths: ORDER_COLUMN_WIDTHS,
    columnShowSort: ORDER_SORT_COLUMNS,
    params: initParams,
    storageKey: "ORDER_GROUP_TABLE",
  });

  const simpleTableProps = useTable({
    columns: ORDER_SIMPLE_COLUMNS,
    columnWidths: ORDER_SIMPLE_COLUMN_WIDTHS,
    storageKey: "ORDER_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>(initParams);

  const isConfirmOrder = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.CONFIRM],
    user,
  ).isMatch;

  const cacheParams = useMemo(
    () => ({
      ...params,
      created_by: !isConfirmOrder && user?.id ? [user.id] : params?.created_by,
    }),
    [isConfirmOrder, params, user?.id],
  );

  return {
    all: tableProps,
    allSimple: simpleTableProps,
    allParams: cacheParams,
    setAllParams: setParams,
  };
};
