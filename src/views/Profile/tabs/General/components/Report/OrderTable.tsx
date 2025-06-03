import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography/";
import { orderApi } from "apis/order";
import { ORDER_LABEL } from "constants/order/label";
import useAuth from "hooks/useAuth";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TColumn, TDGridData } from "types/DGrid";
import { TOrderV2 } from "types/Order";
import { TParams } from "types/Param";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TStyles } from "types/Styles";
import Table from "views/Order/components/Table";

export const ORDER_SIMPLE_COLUMNS: TColumn[] = [
  { name: "order_key", title: ORDER_LABEL.order_key },
  { name: "created", title: ORDER_LABEL.created, type: "datetime" },
  {
    name: "price_total_variant_actual",
    title: ORDER_LABEL.price_total_variant_actual,
    type: "number",
  },
  {
    name: "price_total_variant_actual_input",
    title: ORDER_LABEL.price_total_variant_actual_input,
    type: "number",
  },
  { name: "price_total_order_actual", title: ORDER_LABEL.price_total_order_actual, type: "number" },
];

export const ORDER_SIMPLE_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "order_key", width: 120 },
  { columnName: "created", width: 120 },
  { columnName: "price_total_variant_actual", width: 110 },
  { columnName: "price_total_variant_actual_input", width: 110 },
  { columnName: "price_total_order_actual", width: 130 },
];

type Props = {
  params: TParams;
};

const OrderTable = (props: Props) => {
  const { user } = useAuth();

  const [order, setOrder] = useState<TDGridData<TOrderV2>>({ count: 0, data: [], loading: false });
  const [params, setParams] = useState<TParams>({ limit: 30, page: 1 });

  const orderSimpleTableProps = useTable({
    columns: ORDER_SIMPLE_COLUMNS,
    columnWidths: ORDER_SIMPLE_COLUMN_WIDTHS,
  });

  const getOrder = useCallback(async () => {
    if (user?.id) {
      setOrder((prev) => ({ ...prev, loading: false }));

      const res = await orderApi.get<TOrderV2>({
        params: { ...params, ordering: "-created", created_by: [user?.id], status: "completed" },
      });
      if (res.data) {
        const { count = 0, results = [] } = res.data;
        setOrder((prev) => ({ ...prev, count, data: results, loading: false }));
        return;
      }
      if (res.error.name === CANCEL_REQUEST) {
        return;
      }
      setOrder((prev) => ({ ...prev, loading: false }));
    }
  }, [params, user?.id]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  useEffect(() => {
    setParams((prev) => ({ ...prev, ...props.params }));
  }, [props.params]);

  return (
    <Paper elevation={3}>
      <Typography fontSize={"1.3rem"} style={styles.title} fontWeight="bold">
        {ORDER_LABEL.list_order}
      </Typography>

      <Table
        {...orderSimpleTableProps}
        params={params}
        setParams={setParams}
        data={order}
        onRefresh={getOrder}
      />
    </Paper>
  );
};

export default OrderTable;

const styles: TStyles<"paper" | "title"> = {
  paper: { width: "100%" },
  title: { padding: 16, paddingBottom: 0 },
};
