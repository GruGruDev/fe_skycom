import { Topics } from "views/HelpCenter/components/Topics";
import AddLead from "./components/AddLead.mdx";
import AssignLead from "./components/AssignLead.mdx";
import AssignTelesales from "./components/AssignTelesales.mdx";
import FilterLead from "./components/FilterLead.mdx";
import LeadCenter from "./components/Lead.mdx";
import UpdateLead from "./components/UpdateLead.mdx";

const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */
export const LEAD_TAB = {
  name: "LeadCenter",
  questions: [
    {
      title: "Lead Center là gì và Lead Center có thể làm những gì?",
      desctiption: {
        contents: <LeadCenter components={components}></LeadCenter>,
      },
    },
    {
      title: "Tạo danh sách khách hàng tiềm năng từ file dữ liệu có sẵn.",
      desctiption: {
        contents: <AddLead components={components}></AddLead>,
      },
    },
    {
      title: "Để phân bổ danh sách khách hàng tiềm năng cho từng phòng ban tôi cần làm gì?",
      desctiption: {
        contents: <AssignLead components={components}></AssignLead>,
      },
    },
    {
      title: "Chỉ định người chăm sóc cho những khách hàng tiềm năng như thế nào?",
      desctiption: {
        contents: <AssignTelesales components={components}></AssignTelesales>,
      },
    },
    {
      title: "Tôi muốn cập nhật thông tin liên quan đến khách hàng tiềm năng?",
      desctiption: {
        contents: <UpdateLead components={components}></UpdateLead>,
      },
    },
    {
      title: "Lọc, tìm kiếm và xuất file khách hàng tiềm năng bằng cách nào?",
      desctiption: {
        contents: <FilterLead components={components}></FilterLead>,
      },
    },
  ],
};
const LeadHelpCenter = () => {
  return <Topics data={LEAD_TAB.questions} name={LEAD_TAB.name}></Topics>;
};

export default LeadHelpCenter;
