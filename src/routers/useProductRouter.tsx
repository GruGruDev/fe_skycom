import { Loadable } from "components/Loadings";
import { ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { useLayoutEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getListInventoryReasons, getWarehouses } from "store/redux/warehouses/action";
import { PRODUCT_PATH, ROOT_PATH, TRouter } from "types/Router";
import { lazyWithRetry } from "utils/retryLazyLoad";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";

export const TAB_HEADER_LIST_PRODUCT_ROUTER = (): TRouter[] => [
  {
    path: PRODUCT_PATH.CATEGORY,
    component: <Categoty />,
    role: true,
  },
  // {
  //   path: PRODUCT_PATH.ALL_PRODUCT,
  //   component: <TabAllProduct />,
  //   role: true,
  // },
  // {
  //   path: PRODUCT_PATH.ALL_VARIANT,
  //   component: <TabAllVariant />,
  //   role: true,
  // },
  {
    path: PRODUCT_PATH.SIMPLE_PRODUCT,
    component: <TabSimpleProduct />,
    role: true,
  },
  {
    path: PRODUCT_PATH.SIMPLE_VARIANT,
    component: <TabSimpleVariant />,
    role: true,
  },
  {
    path: PRODUCT_PATH.MATERIAL,
    component: <Material />,
    role: true,
  },
  {
    path: PRODUCT_PATH.COMBO,
    component: <TabCombo />,
    role: true,
  },
];

const useProductRouter = () => {
  const { user } = useAuth();
  const pathname = document.location.pathname;
  const includeProductPath = pathname.includes(ROLE_TAB.PRODUCT);

  useLayoutEffect(() => {
    if (user && includeProductPath) {
      Promise.all([getWarehouses(), getListInventoryReasons()]);
      getWarehouses();
    }
  }, [user, includeProductPath]);

  return {
    path: ROLE_TAB.PRODUCT,
    element: <Outlet />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRouter
            user={user}
            hasPermission={isMatchRoles(user?.role?.data?.[ROLE_TAB.PRODUCT], user?.is_superuser)}
          >
            <Navigate to={`/${PATH_DASHBOARD.product.list[ROOT_PATH]}`} />
          </ProtectedRouter>
        ),
      },
      {
        path: `variant/:id`,
        element: (
          <ProtectedRouter
            user={user}
            hasPermission={isMatchRoles(user?.role?.data?.[ROLE_TAB.PRODUCT], user?.is_superuser)}
          >
            <VariantDetail />
          </ProtectedRouter>
        ),
      },
      {
        path: PRODUCT_PATH.LIST,
        element: <ListProduct />,
        children: [
          {
            path: "",
            element: <Navigate to={`/${PATH_DASHBOARD.product.list[PRODUCT_PATH.CATEGORY]}`} />,
          },
          ...map(TAB_HEADER_LIST_PRODUCT_ROUTER(), (item) => ({
            path: item.path,
            element: (
              <ProtectedRouter user={user} hasPermission={item.role}>
                {item.component}
              </ProtectedRouter>
            ),
          })),
        ],
      },
      {
        path: `material/:id`,
        element: (
          <ProtectedRouter
            user={user}
            hasPermission={isMatchRoles(user?.role?.data?.[ROLE_TAB.PRODUCT], user?.is_superuser)}
          >
            <ProductMaterialDetail />
          </ProtectedRouter>
        ),
      },
    ],
  };
};

export default useProductRouter;

const ListProduct = Loadable(lazyWithRetry(() => import("views/Product")));

const Categoty = Loadable(lazyWithRetry(() => import("views/Product/tabs/Categoty")));
// const TabAllProduct = Loadable(lazyWithRetry(() => import("views/Product/tabs/AllProduct")));
// const TabAllVariant = Loadable(lazyWithRetry(() => import("views/Product/tabs/AllVariant")));
const TabSimpleProduct = Loadable(lazyWithRetry(() => import("views/Product/tabs/SimpleProduct")));
const TabSimpleVariant = Loadable(lazyWithRetry(() => import("views/Product/tabs/SimpleVariant")));
const Material = Loadable(lazyWithRetry(() => import("views/Product/tabs/Material")));
const TabCombo = Loadable(lazyWithRetry(() => import("views/Product/tabs/Combo")));

const VariantDetail = Loadable(lazyWithRetry(() => import("views/VariantDetail")));
const ProductMaterialDetail = Loadable(lazyWithRetry(() => import("views/ProductMaterialDetail")));
