import { Topics } from "views/HelpCenter/components/Topics";
import ActiveAccount from "./components/ActiveAccount.mdx";
import AddAccount from "./components/AddAccount.mdx";
import AddRole from "./components/AddRole.mdx";
import EđitAccount from "./components/EditAccount.mdx";
import EditRole from "./components/EditRole.mdx";
import Configuration from "./components/Introduce.mdx";

const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */
export const SETTING_TAB = {
  name: "Settings",
  questions: [
    {
      title: "Cấu hình là gì?",
      desctiption: {
        contents: <Configuration components={components} />,
      },
    },
    {
      title: "Làm sao để thêm mới một tài khoản?",
      desctiption: {
        contents: <AddAccount components={components} />,
      },
    },
    {
      title: "Tôi muốn thay đổi thông tin tài khoản, tôi cần làm gì?",
      desctiption: {
        contents: <EđitAccount components={components} />,
      },
    },
    {
      title: "Cách để bật/tắt trạng thái hoạt động của một tài khoản bất kì.",
      desctiption: {
        contents: <ActiveAccount components={components}></ActiveAccount>,
      },
    },
    {
      title: "Làm sao để thêm một quyền mới?",
      desctiption: {
        contents: <AddRole components={components}></AddRole>,
      },
    },
    {
      title: "Làm thế nào để tôi có thể chỉnh sửa quyền?",
      desctiption: {
        title: "Để thêm một quyền mới vào hệ thống bạn làm theo các bước sau: ",
        contents: <EditRole components={components}></EditRole>,
      },
    },
  ],
};

const UserHelpCenter = () => {
  return <Topics data={SETTING_TAB.questions} name={SETTING_TAB.name}></Topics>;
};

export default UserHelpCenter;
