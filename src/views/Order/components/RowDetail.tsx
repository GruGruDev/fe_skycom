import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { orderApi } from "apis/order";
import { NoDataPanel } from "components/NoDataPanel";
import { VariantItem, VariantItemColumnName } from "components/Product";
import VariantListHeaderCell from "components/Product/VariantListHeaderCell";
import { useCancelToken } from "hooks/useCancelToken";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import map from "lodash/map";
import { useCallback, useEffect, useState } from "react";
import { OrderDTOV2, OrderLineItemDTO } from "types/Order";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { handleCheckInventory } from "utils/order/handleCheckInventory";
import { handleFormatResToForm } from "utils/order/handleFormatResToForm";
import { handleSizeTable } from "utils/table";

let orders: { [key: string]: { [key: string]: Partial<OrderLineItemDTO> } } = {};

interface Props {
  row: OrderDTOV2;
}
const RowDetail = ({ row }: Props) => {
  const { id = "" } = row;
  const { newCancelToken } = useCancelToken([id]);
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const isDesktop = useResponsive("up", "sm");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ [key: string]: Partial<OrderLineItemDTO> }>({});

  const getOrderByID = useCallback(async () => {
    if (id) {
      if (orders[id]) {
        setData(orders[id]);
        return;
      }
      setLoading(true);

      const resOrder = await orderApi.getById<OrderDTOV2>({
        endpoint: `${id}/`,
        params: { cancelToken: newCancelToken() },
      });
      if (resOrder?.data) {
        const orderFormData = handleFormatResToForm(resOrder?.data);

        const { totalQuantity } = handleCheckInventory({
          lineItems: orderFormData?.line_items,
        });
        orders[id] = totalQuantity;

        setData(totalQuantity);
        setLoading(false);
        return;
      }
      if (resOrder?.error?.name === CANCEL_REQUEST) {
        return;
      }

      setLoading(false);
    }
  }, [newCancelToken, id]);

  useEffect(() => {
    getOrderByID();
  }, [getOrderByID]);

  const hiddenColumns: VariantItemColumnName[] = ["cross_sale", "neo_price", "combo"];

  return (
    <Box width={handleSizeTable(isDesktop, true, isCollapse).width}>
      {loading && <LinearProgress />}
      {orders[id] ? (
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} xl={7}>
            <VariantListHeaderCell hiddenColumns={hiddenColumns} />
          </Grid>
          {map(Object.keys(data), (item: keyof typeof data, index) => (
            <Grid item xs={12} xl={7} key={index}>
              <VariantItem value={data[item]} index={index} hiddenColumns={hiddenColumns} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoDataPanel />
      )}
    </Box>
  );
};

export default RowDetail;
