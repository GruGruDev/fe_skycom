import Box from "@mui/material/Box";
import { PageWithTitle } from "components/Page";
import { useParams } from "react-router-dom";
import OrderForm from "./OrderForm";
import { ORDER_LABEL } from "constants/order/label";

const DetailPage = () => {
  const { id } = useParams();

  const title = id ? `${ORDER_LABEL.order_detail}` : `${ORDER_LABEL.create_order}`;

  return (
    <PageWithTitle title={title} className="order-detail-page">
      <Box display="flex" flexDirection="column" overflow="auto">
        <OrderForm row={{ id }} />
      </Box>
    </PageWithTitle>
  );
};

export default DetailPage;
