import { Loadable } from "components/Loadings";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ATTRIBUTE_PATH } from "types/Router";
import { lazyWithRetry } from "utils/retryLazyLoad";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";
import { checkPermission } from "utils/roleUtils";
import { TUser } from "types/User";
import map from "lodash/map";

const TAB_ATTRIBUTE_ROUTER = (user: Partial<TUser> | null) => [
  {
    path: ATTRIBUTE_PATH.SETTING,
    element: <Setting />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.SETTING], user)
      .isMatch,
  },
  {
    path: ATTRIBUTE_PATH.ORDER,
    element: <Order />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.ORDER], user)
      .isMatch,
  },
  {
    path: ATTRIBUTE_PATH.PRODUCT,
    element: <Product />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.PRODUCT], user)
      .isMatch,
  },
  {
    path: ATTRIBUTE_PATH.WAREHOUSE,
    element: <Warehouse />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.WAREHOUSE], user)
      .isMatch,
  },
  {
    path: ATTRIBUTE_PATH.CUSTOMER,
    element: <Customer />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.CUSTOMER], user)
      .isMatch,
  },
];

const useAttributeRouter = () => {
  const { user } = useAuth();

  const attributeRole = checkPermission(user?.role?.data?.[ROLE_TAB.ATTRIBUTE], user).isMatch;

  const fistRoute = (TAB_ATTRIBUTE_ROUTER(user).find((item) => !!item.role)?.path ||
    ROLE_ATTRIBUTE.LEAD) as keyof typeof PATH_DASHBOARD.attribute;

  return {
    path: ROLE_TAB.ATTRIBUTE,
    element: (
      <ProtectedRouter user={user} hasPermission={attributeRole}>
        <AttributeView />
      </ProtectedRouter>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD.attribute[fistRoute]}`} />,
      },
      ...map(TAB_ATTRIBUTE_ROUTER(user), (item) => ({
        path: item.path,
        element: (
          <ProtectedRouter user={user} hasPermission={item.role}>
            {item.element}
          </ProtectedRouter>
        ),
      })),
    ],
  };
};

export default useAttributeRouter;

const AttributeView = Loadable(lazyWithRetry(() => import("views/Attribute")));
const Setting = Loadable(lazyWithRetry(() => import("views/Attribute/tabs/Setting")));
const Order = Loadable(lazyWithRetry(() => import("views/Attribute/tabs/Order")));
const Product = Loadable(lazyWithRetry(() => import("views/Attribute/tabs/Product")));
const Warehouse = Loadable(lazyWithRetry(() => import("views/Attribute/tabs/WarehouseSheet")));
const Customer = Loadable(lazyWithRetry(() => import("views/Attribute/tabs/Customer")));
