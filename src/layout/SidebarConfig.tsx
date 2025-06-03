import CategoryIcon from "@mui/icons-material/Category";
import ContactsIcon from "@mui/icons-material/Contacts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TuneIcon from "@mui/icons-material/Tune";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { LABEL } from "constants/label";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_CUSTOMER, ROLE_ORDER, ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import { PATH_DASHBOARD } from "routers/paths";
import { TNaviListProps } from "types/NavSection";
import { ROOT_PATH } from "types/Router";
import { checkPermission, isMatchRoles } from "utils/roleUtils";
// ----------------------------------------------------------------------

export const THEME_TITLE = "Theme";
export interface SidebarItemType {
  subheader: string;
  items: TNaviListProps[];
}

const SidebarConfig = ({
  handleShowThemeModal,
}: {
  handleShowThemeModal?: () => void;
}): SidebarItemType[] => {
  const { user } = useAuth();

  return [
    {
      subheader: "General",
      items: [
        {
          title: PAGE_TITLE.settings[ROOT_PATH],
          path: PATH_DASHBOARD.settings[ROOT_PATH],
          icon: <SettingsIcon />,
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS], user).isMatch,
          code: "setting",
        },
      ],
    },
    {
      subheader: "Management",
      items: [
        {
          title: PAGE_TITLE.dashboard,
          path: PATH_DASHBOARD.dashboard,
          icon: <DashboardIcon />,
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.DASHBOARD], user).isMatch,
        },
        {
          title: PAGE_TITLE.orders[ROOT_PATH],
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.ORDERS], user).isMatch,
          path: PATH_DASHBOARD.orders[ROOT_PATH],
          icon: <ShoppingBagIcon />,
          children: [
            {
              title: PAGE_TITLE.orders.list[ROOT_PATH],
              roles: isMatchRoles(
                [
                  user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.HANDLE],
                  user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.CONFIRM],
                ],
                user?.is_superuser,
              ),
              path: PATH_DASHBOARD.orders.list[ROOT_PATH],
              code: "order-status",
            },
            {
              title: PAGE_TITLE.orders.report[ROOT_PATH],
              roles: checkPermission(user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.REPORT], user)
                .isMatch,
              path: PATH_DASHBOARD.orders.report[ROOT_PATH],
              code: "order-status",
            },
          ],
        },
        {
          title: PAGE_TITLE.product[ROOT_PATH],
          path: PATH_DASHBOARD.product[ROOT_PATH],
          icon: <CategoryIcon />,
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.PRODUCT], user).isMatch,
          code: "product",
          children: [
            {
              title: PAGE_TITLE.product.list[ROOT_PATH],
              path: PATH_DASHBOARD.product.list[ROOT_PATH],
              roles: checkPermission(user?.role?.data?.[ROLE_TAB.PRODUCT], user).isMatch,
              code: "list-product",
            },
          ],
        },
        {
          title: PAGE_TITLE.warehouse[ROOT_PATH],
          path: PATH_DASHBOARD.warehouse[ROOT_PATH],
          icon: <WarehouseIcon />,
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.WAREHOUSE], user).isMatch,
          code: "warehouse",
          children: [
            {
              title: PAGE_TITLE.warehouse.list[ROOT_PATH],
              path: PATH_DASHBOARD.warehouse.list[ROOT_PATH],
              roles: isMatchRoles(
                [
                  user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE],
                  user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
                  user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
                  user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
                  user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
                  user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.SCAN],
                ],
                user?.is_superuser,
              ),
              code: "list-warehouse",
            },
            {
              title: PAGE_TITLE.warehouse.scan,
              path: PATH_DASHBOARD.warehouse.scan,
              roles: checkPermission(
                user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.SCAN],
                user,
              ).isMatch,
              code: "warehouse-scan",
            },
            {
              title: PAGE_TITLE.warehouse.inventory,
              path: PATH_DASHBOARD.warehouse.inventory,
              roles: checkPermission(
                user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.INVENTORY],
                user,
              ).isMatch,
              code: "warehouse-inventory",
            },
          ],
        },
        {
          title: PAGE_TITLE.customer[ROOT_PATH],
          path: PATH_DASHBOARD.customer[ROOT_PATH],
          icon: <ContactsIcon />,
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.CUSTOMER], user).isMatch,
          code: "customer",
          children: [
            {
              title: PAGE_TITLE.customer.list[ROOT_PATH],
              path: PATH_DASHBOARD.customer.list[ROOT_PATH],
              roles: checkPermission(
                user?.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.HANDLE],
                user,
              ).isMatch,
              code: "list-customer",
            },
          ],
        },
      ],
    },
    {
      subheader: "System",
      items: [
        {
          title: LABEL.ATTRIBUTE,
          path: PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][ROOT_PATH],
          icon: <ListAltIcon />,
          roles: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE], user).isMatch,
          code: "attribute",
        },
        {
          title: THEME_TITLE,
          path: "",
          onClick: handleShowThemeModal,
          icon: <TuneIcon />,
          roles: true,
          code: "theme",
        },
        {
          title: LABEL.HELPCENTER,
          path: PATH_DASHBOARD[ROLE_TAB.HELP_CENTER][ROOT_PATH],
          icon: <HelpCenterIcon />,
          roles: true,
          code: "help-center",
        },
      ],
    },
  ];
};

export default SidebarConfig;
