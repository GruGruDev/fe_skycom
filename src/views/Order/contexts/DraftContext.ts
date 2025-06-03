import {
  ORDER_COLUMNS,
  ORDER_COLUMN_WIDTHS,
  ORDER_HIDDEN_COLUMN_NAMES,
  ORDER_SIMPLE_COLUMNS,
  ORDER_SIMPLE_COLUMN_WIDTHS,
  ORDER_SORT_COLUMNS,
} from "constants/order/columns";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import useTable from "hooks/useTable";
import { useMemo, useState } from "react";
import { TDGrid } from "types/DGrid";
import { TOrderStatus } from "types/Order";
import { TParams } from "types/Param";
import { checkPermission } from "utils/roleUtils";

const initParams = {
  limit: 30,
  page: 1,
  ordering: "-created",
  status: [TOrderStatus.DRAFT],
};

const DRAFT_ORDER_HIDDEN_COLUMN_NAMES = [...ORDER_HIDDEN_COLUMN_NAMES, "print_info"];

export type DraftContext = {
  draft: Partial<TDGrid>;
  draftSimple: Partial<TDGrid>;
  draftParams: TParams;
  setDraftParams: React.Dispatch<React.SetStateAction<TParams>>;
};

export const useDraftContext = (): Partial<DraftContext> => {
  const { user } = useAuth();

  const tableProps = useTable({
    columns: ORDER_COLUMNS,
    columnWidths: ORDER_COLUMN_WIDTHS,
    hiddenColumnNames: DRAFT_ORDER_HIDDEN_COLUMN_NAMES,
    columnShowSort: ORDER_SORT_COLUMNS,
    storageKey: "DRAFT_ORDER_GROUP_TABLE",
  });
  const simpleTableProps = useTable({
    columns: ORDER_SIMPLE_COLUMNS,
    columnWidths: ORDER_SIMPLE_COLUMN_WIDTHS,
    hiddenColumnNames: ["shipping", "cancel_reason", "complete_time"],
    storageKey: "DRAFT_ORDER_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>(initParams);

  const isConfirmOrder = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.CONFIRM],
    user,
  ).isMatch;

  const cacheParams = useMemo(
    () => ({
      ...params,
      status: [TOrderStatus.DRAFT],
      created_by: !isConfirmOrder && user?.id ? [user.id] : params?.created_by,
    }),
    [isConfirmOrder, params, user?.id],
  );

  return {
    draft: tableProps,
    draftSimple: simpleTableProps,
    draftParams: cacheParams,
    setDraftParams: setParams,
  };
};
