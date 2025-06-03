import { Topics } from "views/HelpCenter/components/Topics";
import CreateCustomer from "./components/CreateCutomer.mdx";
import ManagementCustomer from "./components/ManagementCustomer.mdx";
const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */

export const CUSTOMER_TAB = {
  name: "Customer",
  questions: [
    {
      title: "Để tạo mới khách hàng tôi phải làm thế nào?",
      desctiption: {
        contents: <CreateCustomer components={components} />,
      },
    },
    {
      title: "Tôi muốn quản lý thông tin của khách hàng bằng cách nào?",
      desctiption: {
        contents: <ManagementCustomer components={components} />,
      },
    },
  ],
};
const CustomerHelpCenter = () => {
  return <Topics data={CUSTOMER_TAB.questions} name={CUSTOMER_TAB.name}></Topics>;
};

export default CustomerHelpCenter;
