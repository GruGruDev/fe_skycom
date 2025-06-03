import { Loadable } from "components/Loadings";
import { ROLE_HELP_CENTER, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { Navigate } from "react-router-dom";
import { HELPCENTER_PATH, TRouter } from "types/Router";
import { TUser } from "types/User";
import { lazyWithRetry } from "utils/retryLazyLoad";
import { checkPermission } from "utils/roleUtils";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";

const TAB_HELPCENTER_ROUTER = (user: Partial<TUser> | null): TRouter[] => [
  {
    path: HELPCENTER_PATH.SETTING,
    component: <User />,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.SETTING],
      user,
    ).isMatch,
  },
  {
    path: HELPCENTER_PATH.LEAD,
    component: <Lead />,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.LEAD_CENTER],
      user,
    ).isMatch,
  },
  {
    path: HELPCENTER_PATH.ORDER,
    component: <Order />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.ORDER], user)
      .isMatch,
  },
  {
    path: HELPCENTER_PATH.DELIVERY,
    component: <Delivery />,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.DELIVERY],
      user,
    ).isMatch,
  },
  {
    path: HELPCENTER_PATH.PRODUCT,
    component: <Product />,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.PRODUCT],
      user,
    ).isMatch,
  },
  {
    path: HELPCENTER_PATH.WAREHOUSE,
    component: <Warehouse />,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.WAREHOUSE],
      user,
    ).isMatch,
  },
  {
    path: HELPCENTER_PATH.CUSTOMER,
    component: <Customer />,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.HELP_CENTER]?.[ROLE_HELP_CENTER.CUSTOMER],
      user,
    ).isMatch,
  },
];

const useHelpCenterRouter = () => {
  const { user } = useAuth();
  const fistRoute = HELPCENTER_PATH.SETTING as keyof (typeof PATH_DASHBOARD)["help-center"];

  const isControlHelpCenter = checkPermission(
    user?.role?.data?.[ROLE_TAB.HELP_CENTER],
    user,
  ).isMatch;

  return {
    path: ROLE_TAB.HELP_CENTER,
    element: (
      <ProtectedRouter user={user} hasPermission={isControlHelpCenter}>
        <HelpCenterView />
      </ProtectedRouter>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD["help-center"][fistRoute]}`} />,
      },
      ...map(TAB_HELPCENTER_ROUTER(user), (item) => ({
        path: item.path,
        element: <ProtectedRouter user={user}>{item.component}</ProtectedRouter>,
      })),
    ],
  };
};

export default useHelpCenterRouter;

const HelpCenterView = Loadable(lazyWithRetry(() => import("views/HelpCenter")));
const Lead = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/Lead")));
const Order = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/Order")));
const Delivery = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/Delivery")));
const Product = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/Product")));
const User = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/User")));
const Warehouse = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/Warehouse")));
const Customer = Loadable(lazyWithRetry(() => import("views/HelpCenter/tabs/Customer")));
