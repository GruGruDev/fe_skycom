import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { orderApi } from "apis/order";
import { AttributeColumn, LinkColumn, TableWrapper } from "components/Table";
import { HeaderWrapper } from "components/Table/Header";
import {
  CUSTOMER_ORDER_COLUMN,
  CUSTOMER_ORDER_COLUMN_WIDTHS,
  CUSTOMER_PRODUCT_COLUMN,
  CUSTOMER_PRODUCT_COLUMN_WIDTHS,
} from "constants/customer/columns";
import { useCancelToken } from "hooks/useCancelToken";
import useTable from "hooks/useTable";
import flatten from "lodash/flatten";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TDGridData } from "types/DGrid";
import { OrderDTOV2, OrderLineItemDTO } from "types/Order";
import { CANCEL_REQUEST } from "types/ResponseApi";
import PriceInfoColumn from "views/Product/components/columns/PriceInfoColumn";
import ProductInfoColumn from "../components/columns/ProductInfoColumn";
import { PRODUCT_LABEL } from "constants/product/label";
import { CUSTOMER_LABEL } from "constants/customer/label";
import StatusColumn from "components/Table/columns/StatusColumn";
import { ORDER_STATUS } from "constants/order";
import { TStyles } from "types/Styles";
import { heightTableByDataLength } from "utils/table";
import { handleCheckInventory } from "utils/order/handleCheckInventory";

const initParams = { limit: 200, page: 1, ordering: "-created" };

const Order = () => {
  const { id } = useParams();

  const { newCancelToken } = useCancelToken();

  const orderTableProps = useTable({
    columns: CUSTOMER_ORDER_COLUMN,
    columnWidths: CUSTOMER_ORDER_COLUMN_WIDTHS,
    params: initParams,
  });

  const productTableProps = useTable({
    columns: CUSTOMER_PRODUCT_COLUMN,
    columnWidths: CUSTOMER_PRODUCT_COLUMN_WIDTHS,
    params: initParams,
  });

  const [orderData, setOrderData] = useState<TDGridData<Partial<OrderDTOV2>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const [productDdata, setProductData] = useState<TDGridData<Partial<OrderLineItemDTO>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getOrderDetail = useCallback(
    async (orderId: string) => {
      const resOrder = await orderApi.getById<OrderDTOV2>({
        endpoint: `${orderId}/`,
        params: { cancelToken: newCancelToken() },
      });
      if (resOrder.data) {
        return resOrder.data.line_items as OrderLineItemDTO[];
      }
      return [];
    },
    [newCancelToken],
  );

  const getData = useCallback(async () => {
    if (id) {
      setOrderData((prev) => ({ ...prev, loading: true }));
      setProductData((prev) => ({ ...prev, loading: true }));

      const result = await orderApi.get<OrderDTOV2>({
        params: { ...orderTableProps.params, customer: id, cancelToken: newCancelToken() },
      });
      if (result?.data) {
        const { count = 0, results = [] } = result.data;
        setOrderData({ data: results, count, loading: false });

        // get từng order detail
        const listOrderDetailLineItems = await Promise.all(
          results.map((item) => getOrderDetail(item.id || "")),
        );

        // total item
        const { totalQuantity } = handleCheckInventory({
          lineItems: flatten(listOrderDetailLineItems),
        });

        const productItems = Object.values(totalQuantity);

        setProductData({
          data: productItems,
          count: productItems.length || 0,
          loading: false,
        });

        return;
      }

      if (result.error.name === CANCEL_REQUEST) {
        return;
      }

      setOrderData((prev) => ({ ...prev, loading: false }));
      setProductData((prev) => ({ ...prev, loading: false }));
    }
  }, [orderTableProps.params, newCancelToken, id, getOrderDetail]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Box mt={2}>
      <Paper elevation={3} sx={{ padding: "8px" }}>
        <HeaderWrapper tableTitle={CUSTOMER_LABEL.order} style={styles.header} />

        <TableWrapper
          {...orderTableProps}
          data={orderData}
          heightTable={heightTableByDataLength(orderData.data.length)}
        >
          <LinkColumn
            for={["order_key"]}
            linkFromRow={(row) => `${window.location.origin}//${row?.id}`}
          />
          <AttributeColumn for={["tags"]} />
          <StatusColumn for={["status"]} options={ORDER_STATUS} />
        </TableWrapper>
      </Paper>

      <Paper elevation={3} sx={{ padding: "8px", marginTop: "16px" }}>
        <Stack alignItems="flex-start" p={2}>
          <Typography fontSize={"1rem"} fontWeight="bold">
            {PRODUCT_LABEL.product}
          </Typography>
        </Stack>

        <TableWrapper
          {...productTableProps}
          data={productDdata}
          heightTable={heightTableByDataLength(productDdata.data.length)}
          cellStyle={{ minHeight: "80px" }}
        >
          <ProductInfoColumn />
          <PriceInfoColumn />
        </TableWrapper>
      </Paper>
    </Box>
  );
};

export default Order;

const styles: TStyles<"header"> = {
  header: { paddingTop: "0px" },
};
