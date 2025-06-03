import CategoryIcon from "@mui/icons-material/Category";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SettingsIcon from "@mui/icons-material/Settings";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { TabRouteWrap } from "components/Tabs";
import { LABEL } from "constants/label";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { FunctionComponent } from "react";
import { PATH_DASHBOARD } from "routers/paths";
import { ATTRIBUTE_PATH, TTabRoute } from "types/Router";
import { TUser } from "types/User";
import { checkPermission } from "utils/roleUtils";

const attributeRouter = (user: Partial<TUser> | null): TTabRoute[] => [
  {
    label: PAGE_TITLE.attribute[ATTRIBUTE_PATH.SETTING],
    path: `/${PATH_DASHBOARD.attribute[ATTRIBUTE_PATH.SETTING]}`,
    icon: <SettingsIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.SETTING], user)
      .isMatch,
  },
  {
    path: `/${PATH_DASHBOARD.attribute[ATTRIBUTE_PATH.ORDER]}`,
    label: PAGE_TITLE.attribute[ATTRIBUTE_PATH.ORDER],
    icon: <LocalMallIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.ORDER], user)
      .isMatch,
  },
  {
    path: `/${PATH_DASHBOARD.attribute[ATTRIBUTE_PATH.PRODUCT]}`,
    label: PAGE_TITLE.attribute[ATTRIBUTE_PATH.PRODUCT],
    icon: <CategoryIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.PRODUCT], user)
      .isMatch,
  },
  {
    path: `/${PATH_DASHBOARD.attribute[ATTRIBUTE_PATH.WAREHOUSE]}`,
    label: PAGE_TITLE.attribute[ATTRIBUTE_PATH.WAREHOUSE],
    icon: <WarehouseIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.WAREHOUSE], user)
      .isMatch,
  },
  {
    path: `/${PATH_DASHBOARD.attribute[ATTRIBUTE_PATH.CUSTOMER]}`,
    label: PAGE_TITLE.attribute[ATTRIBUTE_PATH.CUSTOMER],
    icon: <ContactMailIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.CUSTOMER], user)
      .isMatch,
  },
];

const Components: FunctionComponent = () => {
  const { user } = useAuth();
  return <TabRouteWrap routes={attributeRouter(user)} title={LABEL.ATTRIBUTE} />;
};

export default Components;
