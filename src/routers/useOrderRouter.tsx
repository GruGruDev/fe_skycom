import { Loadable } from "components/Loadings";
import { ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { useLayoutEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getListVariant } from "store/redux/products/action";
import { getListInventoryReasons, getWarehouses } from "store/redux/warehouses/action";
import { ORDER_PATH, ROOT_PATH } from "types/Router";
import { lazyWithRetry } from "utils/retryLazyLoad";
import { isMatchRoles } from "utils/roleUtils";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";

const useOrderRouter = () => {
  const { user } = useAuth();
  const pathname = document.location.pathname;
  const includeOrderPath = pathname.includes(ROLE_TAB.ORDERS);

  useLayoutEffect(() => {
    if (user && includeOrderPath) {
      getWarehouses();
      getListVariant();
      getListInventoryReasons();
    }
  }, [user, includeOrderPath]);

  return {
    path: ROLE_TAB.ORDERS,
    element: <Outlet />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRouter
            user={user}
            hasPermission={isMatchRoles(user?.role?.data?.[ROLE_TAB.ORDERS], user?.is_superuser)}
          >
            <Outlet />
          </ProtectedRouter>
        ),
        children: [
          {
            path: "",
            element: <Navigate to={`/${PATH_DASHBOARD.orders.list[ROOT_PATH]}`} />,
          },

          {
            path: ORDER_PATH.LIST,
            element: (
              <ProtectedRouter hasPermission={true} user={user}>
                <OrderView />
              </ProtectedRouter>
            ),
            children: [
              { path: ``, element: <Navigate to={`/${PATH_DASHBOARD.orders.list.all}`} /> },
              { path: ORDER_PATH.DRAFT, element: <Draft /> },
              { path: ORDER_PATH.COMPLETED, element: <Completed /> },
              { path: ORDER_PATH.CANCEL, element: <Cancel /> },
              { path: ORDER_PATH.ALL, element: <All /> },
            ],
          },
          { path: ORDER_PATH.CREATE, element: <Create /> },
          {
            path: ORDER_PATH.REPORT,
            element: <Report />,
            children: [
              {
                path: ``,
                element: <Navigate to={`/${PATH_DASHBOARD.orders.report["report-order"]}`} />,
              },
              { path: ORDER_PATH.REPORT_ORDER, element: <ReportOrder /> },
              { path: ORDER_PATH.REPORT_VARIANT_REVENUE, element: <ReportVariantRevenue /> },
              { path: ORDER_PATH.REPORT_CARRIER_REVENUE, element: <ReportCarrierRevenue /> },
            ],
          },
        ],
      },
      {
        path: `:id`,
        element: (
          <ProtectedRouter
            user={user}
            hasPermission={isMatchRoles(user?.role?.data?.[ROLE_TAB.ORDERS], user?.is_superuser)}
          >
            <DetailPage />
          </ProtectedRouter>
        ),
      },
    ],
  };
};
export default useOrderRouter;

const OrderView = Loadable(lazyWithRetry(() => import("views/Order")));

const All = Loadable(lazyWithRetry(() => import("views/Order/tabs/All")));
const Draft = Loadable(lazyWithRetry(() => import("views/Order/tabs/Draft")));
const Cancel = Loadable(lazyWithRetry(() => import("views/Order/tabs/Cancel")));
const Completed = Loadable(lazyWithRetry(() => import("views/Order/tabs/Completed")));
const Create = Loadable(lazyWithRetry(() => import("views/Order/components/CreatePage")));
const DetailPage = Loadable(lazyWithRetry(() => import("views/Order/components/DetailPage")));

const Report = Loadable(lazyWithRetry(() => import("views/OrdersReport")));
const ReportOrder = Loadable(lazyWithRetry(() => import("views/OrdersReport/tabs/ReportOrder")));
const ReportVariantRevenue = Loadable(
  lazyWithRetry(() => import("views/OrdersReport/tabs/ReportVariantRevenue")),
);
const ReportCarrierRevenue = Loadable(
  lazyWithRetry(() => import("views/OrdersReport/tabs/ReportCarrierRevenue")),
);
