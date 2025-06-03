import { Topics } from "views/HelpCenter/components/Topics";
import CancelDelivery from "./components/CancelDelivery.mdx";
import Delivery from "./components/Delivery.mdx";
import SearchDelivery from "./components/Search.mdx";
import StatusDelivery from "./components/StatusDelivery.mdx";

const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */
export const DELIVERY_TAB = {
  name: "Delivery",
  questions: [
    {
      title: "Tôi muốn hiểu rõ về những trạng thái giao hàng?",
      desctiption: {
        contents: <StatusDelivery components={components}></StatusDelivery>,
      },
    },
    {
      title: "Làm thế nào để thực hiện giao hàng?",
      desctiption: {
        title: "Để theo dõi trạng thái đơn hàng vui lòng làm theo hướng dẫn sau:",
        contents: <Delivery components={components}></Delivery>,
      },
    },
    {
      title: "Muốn huỷ giao hàng thì cần phải làm gì?",
      desctiption: {
        contents: <CancelDelivery components={components}></CancelDelivery>,
      },
    },
    {
      title: "Tôi muốn tìm kiếm đơn hàng, tôi cần phải làm gì?",
      desctiption: {
        contents: <SearchDelivery components={components}></SearchDelivery>,
      },
    },
  ],
};
const DeliveryHelpCenter = () => {
  return <Topics data={DELIVERY_TAB.questions} name={DELIVERY_TAB.name}></Topics>;
};

export default DeliveryHelpCenter;
