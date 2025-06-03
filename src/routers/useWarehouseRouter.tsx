import { Loadable } from "components/Loadings";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { useLayoutEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getWarehouses } from "store/redux/warehouses/action";
import { ROOT_PATH, TRouter, WAREHOUSE_PATH } from "types/Router";
import { lazyWithRetry } from "utils/retryLazyLoad";
import { checkPermission, isMatchRoles } from "utils/roleUtils";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";
import { TUser } from "types/User";

// -------------------------------------------------------------------

export const TAB_WAREHOUSE_ROUTER = (user: Partial<TUser> | null): TRouter[] => [
  {
    path: WAREHOUSE_PATH.ALL,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE], user)
      .isMatch,
    component: <All />,
  },
  {
    path: WAREHOUSE_PATH.SHEET_IMPORT,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
      user,
    ).isMatch,
    component: <Import />,
  },
  {
    path: WAREHOUSE_PATH.SHEET_EXPORT,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
      user,
    ).isMatch,
    component: <Export />,
  },
  {
    path: WAREHOUSE_PATH.SHEET_TRANSFER,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
      user,
    ).isMatch,
    component: <Transfer />,
  },
  {
    path: WAREHOUSE_PATH.SHEET_CHECKING,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
      user,
    ).isMatch,
    component: <Checking />,
  },
  {
    path: WAREHOUSE_PATH.INVENTORY_HISTORY,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.INVENTORY_HISTORY],
      user,
    ).isMatch,
    component: <History />,
  },
  {
    path: WAREHOUSE_PATH.SCAN_HISTORY,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.SCAN], user)
      .isMatch,
    component: <HistoryScan />,
  },
];

const useWarehouseRouter = () => {
  const { user } = useAuth();
  const pathname = document.location.pathname;
  const includeWarehousePath = pathname.includes(ROLE_TAB.WAREHOUSE);

  const warehoueFirstRoute = TAB_WAREHOUSE_ROUTER(user).find((item) => !!item.role)?.path;
  useLayoutEffect(() => {
    if (user && includeWarehousePath) {
      getWarehouses();
    }
  }, [user, includeWarehousePath]);

  const isControlListWarehouse = isMatchRoles(
    [user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE]],
    user?.is_superuser,
  );

  const isWriteWarehouseScan = isMatchRoles(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.SCAN],
    user?.is_superuser,
  );

  const isReadInventory = isMatchRoles(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.INVENTORY],
    user?.is_superuser,
  );

  return {
    path: ROLE_TAB.WAREHOUSE,
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD.warehouse.list[ROOT_PATH]}`} />,
      },
      {
        path: `:id`,
        element: (
          <ProtectedRouter user={user} hasPermission={isControlListWarehouse}>
            <WarehouseDetail />
          </ProtectedRouter>
        ),
      },
      {
        path: `${WAREHOUSE_PATH.SHEET}/:id`,
        element: <SheetDetail />,
      },
      {
        path: `${WAREHOUSE_PATH.SCAN}`,
        element: (
          <ProtectedRouter user={user} hasPermission={isWriteWarehouseScan}>
            <WarehouseScan />
          </ProtectedRouter>
        ),
      },
      {
        path: `${WAREHOUSE_PATH.INVENTORY}`,
        element: (
          <ProtectedRouter user={user} hasPermission={isReadInventory}>
            <WarehouseInventory />
          </ProtectedRouter>
        ),
      },
      {
        path: WAREHOUSE_PATH.LIST,
        element: (
          <ProtectedRouter user={user} hasPermission={isControlListWarehouse}>
            <Warehouse />
          </ProtectedRouter>
        ),
        children: [
          {
            path: "",
            element: (
              <Navigate
                to={`/${PATH_DASHBOARD.warehouse.list[warehoueFirstRoute as keyof typeof PATH_DASHBOARD.warehouse.list]}`}
              />
            ),
          },
          ...map(TAB_WAREHOUSE_ROUTER(user), (item) => ({
            path: item.path,
            element: (
              <ProtectedRouter user={user} hasPermission={item.role}>
                {item.component}
              </ProtectedRouter>
            ),
          })),
        ],
      },
    ],
  };
};

export default useWarehouseRouter;

const Warehouse = Loadable(lazyWithRetry(() => import("views/Warehouse")));
const WarehouseDetail = Loadable(lazyWithRetry(() => import("views/WarehouseDetail")));
const WarehouseScan = Loadable(lazyWithRetry(() => import("views/WarehouseScan")));

const WarehouseInventory = Loadable(lazyWithRetry(() => import("views/WarehouseInventory")));

const All = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/All")));
const Import = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/Import")));
const Export = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/Export")));
const Transfer = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/Transfer")));
const Checking = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/Checking")));
const History = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/History")));
const HistoryScan = Loadable(lazyWithRetry(() => import("views/Warehouse/tabs/ScanHistory")));

const SheetDetail = Loadable(lazyWithRetry(() => import("views/SheetDetail")));
