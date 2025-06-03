import BallotIcon from "@mui/icons-material/Ballot";
import CategoryIcon from "@mui/icons-material/Category";
import Diversity1Icon from "@mui/icons-material/Diversity1";

import { TabRouteWrap } from "components/Tabs";
import { PAGE_TITLE } from "constants/pageTitle";
import { PATH_DASHBOARD } from "routers/paths";
import { ROOT_PATH } from "types/Router";

export const ORDER_TABS = [
  {
    label: PAGE_TITLE.orders.report["report-order"],
    path: `/${PATH_DASHBOARD.orders.report["report-order"]}`,
    icon: <BallotIcon />,
  },
  {
    label: PAGE_TITLE.orders.report["report-variant-revenue"],
    path: `/${PATH_DASHBOARD.orders.report["report-variant-revenue"]}`,
    icon: <CategoryIcon />,
  },
  {
    label: PAGE_TITLE.orders.report["report-carrier-revenue"],
    path: `/${PATH_DASHBOARD.orders.report["report-carrier-revenue"]}`,
    icon: <Diversity1Icon />,
  },
];

const ReportPage = () => {
  return <TabRouteWrap routes={ORDER_TABS} title={`${PAGE_TITLE.orders.report[ROOT_PATH]}`} />;
};

export default ReportPage;
