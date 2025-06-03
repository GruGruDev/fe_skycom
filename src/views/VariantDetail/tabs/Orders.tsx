import { NoDataPanel } from "components/NoDataPanel";
import {
  ORDER_COLUMNS,
  ORDER_COLUMN_WIDTHS,
  ORDER_SIMPLE_COLUMNS,
  ORDER_SIMPLE_COLUMN_WIDTHS,
  ORDER_SORT_COLUMNS,
} from "constants/order/columns";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import useTable from "hooks/useTable";
import { useState } from "react";
import { TParams } from "types/Param";
import Container from "views/Order/components/Container";
import MContainer from "views/Order/components/MContainer";

const Orders = ({ variantId }: { variantId?: string }) => {
  const isDesktop = useResponsive("up", "sm");

  const { tableLayout } = useSettings();
  const groupTableProps = useTable({
    columns: ORDER_COLUMNS,
    columnWidths: ORDER_COLUMN_WIDTHS,
    columnShowSort: ORDER_SORT_COLUMNS,
  });

  const simpleTableProps = useTable({
    columns: ORDER_SIMPLE_COLUMNS,
    columnWidths: ORDER_SIMPLE_COLUMN_WIDTHS,
  });

  const [params, setParams] = useState<TParams>({
    limit: 500,
    page: 1,
    order: "-created",
    variant: variantId,
  });

  const tableProps = tableLayout === "group" ? groupTableProps : simpleTableProps;

  return variantId ? (
    isDesktop ? (
      <Container
        tabName="all"
        {...tableProps}
        params={params}
        setParams={setParams}
        isShowDetail={false}
        isFilterTag
        isFilterOrderStatus
        isFilterCreator
        isFilterConfirmDate
        isFilterPaymentType
        isFilterDate
        isFilterSource
        isCreate={false}
        editComponent={undefined}
      />
    ) : (
      <MContainer params={params} setParams={setParams} integrate={false} />
    )
  ) : (
    <NoDataPanel />
  );
};

export default Orders;
