import Order from "./components/Introduce.mdx";
import CreateOrder from "./components/CreateOrder.mdx";
import ManagementOrder from "./components/ManagementOrder.mdx";
import CancelOrder from "./components/CancelOrder.mdx";
import ReportlOrder from "./components/ReportOrder.mdx";
import { Topics } from "views/HelpCenter/components/Topics";

const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */
export const ORDER_TAB = {
  name: "Order",
  questions: [
    {
      title: "Tìm hiểu về đơn hàng?",
      desctiption: {
        title: "Đơn hàng là gì?",
        contents: <Order components={components}></Order>,
      },
    },
    {
      title: "Làm thế nào để tạo đơn hàng mới trong hệ thống không?",
      desctiption: {
        contents: <CreateOrder components={components}></CreateOrder>,
      },
    },
    {
      title: "Tôi muốn quản lý đơn hàng thì phải làm thế nào?",
      desctiption: {
        contents: <ManagementOrder components={components}></ManagementOrder>,
      },
    },
    {
      title: "Huỷ đơn hàng bằng cách nào?",
      desctiption: {
        contents: <CancelOrder components={components}></CancelOrder>,
      },
    },
    {
      title: "Xem báo cáo đơn hàng ?",
      desctiption: {
        contents: <ReportlOrder components={components}></ReportlOrder>,
      },
    },
  ],
};
const OrderHelpCenter = () => {
  return <Topics data={ORDER_TAB.questions} name={ORDER_TAB.name}></Topics>;
};

export default OrderHelpCenter;
