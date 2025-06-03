import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { TabRouteWrap } from "components/Tabs";
import { LABEL } from "constants/label";
import { PAGE_TITLE } from "constants/pageTitle";
import { FunctionComponent } from "react";
import { PATH_DASHBOARD } from "routers/paths";
import { HELPCENTER_PATH, TTabRoute } from "types/Router";
import "./HelpCenterStyle.css";

const HELP_CENTER_TABS: TTabRoute[] = [
  {
    label: PAGE_TITLE["help-center"][HELPCENTER_PATH.SETTING],
    path: `/${PATH_DASHBOARD["help-center"][HELPCENTER_PATH.SETTING]}`,
    icon: <AccountCircleIcon />,
  },
  {
    path: `/${PATH_DASHBOARD["help-center"][HELPCENTER_PATH.ORDER]}`,
    label: PAGE_TITLE["help-center"][HELPCENTER_PATH.ORDER],
    icon: <LocalMallIcon />,
  },
  {
    path: `/${PATH_DASHBOARD["help-center"][HELPCENTER_PATH.PRODUCT]}`,
    label: PAGE_TITLE["help-center"][HELPCENTER_PATH.PRODUCT],
    icon: <CategoryIcon />,
  },
  {
    path: `/${PATH_DASHBOARD["help-center"][HELPCENTER_PATH.WAREHOUSE]}`,
    label: PAGE_TITLE["help-center"][HELPCENTER_PATH.WAREHOUSE],
    icon: <WarehouseIcon />,
  },
  {
    path: `/${PATH_DASHBOARD["help-center"][HELPCENTER_PATH.CUSTOMER]}`,
    label: PAGE_TITLE["help-center"][HELPCENTER_PATH.CUSTOMER],
    icon: <ContactMailIcon />,
  },
];

const Components: FunctionComponent = () => {
  return <TabRouteWrap routes={HELP_CENTER_TABS} title={LABEL.ATTRIBUTE} />;
};

export default Components;
