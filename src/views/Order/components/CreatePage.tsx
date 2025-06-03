import { PageWithTitle } from "components/Page";
import HeaderPage from "components/Page/HeaderPage";
import { ORDER_LABEL } from "constants/order/label";
import { PATH_DASHBOARD } from "routers/paths";
import OrderForm from "./OrderForm";

const CreatePage = () => {
  return (
    <PageWithTitle title={ORDER_LABEL.create_order}>
      <HeaderPage link={`/${PATH_DASHBOARD.orders.list[""]}`} />
      <OrderForm />
    </PageWithTitle>
  );
};

export default CreatePage;
