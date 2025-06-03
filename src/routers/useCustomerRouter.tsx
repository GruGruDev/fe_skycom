import { Loadable } from "components/Loadings";
import { ROLE_CUSTOMER, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { lazyWithRetry } from "utils/retryLazyLoad";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";
import { CUSTOMER_TAB_PATH, ROOT_PATH } from "types/Router";
import { isMatchRoles } from "utils/roleUtils";

const useCustomerRoute = () => {
  const { user } = useAuth();

  const customerRole = isMatchRoles(
    user?.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.HANDLE],
    user?.is_superuser,
  );

  return {
    path: ROLE_TAB.CUSTOMER,
    element: (
      <ProtectedRouter user={user} hasPermission={customerRole}>
        <Outlet />
      </ProtectedRouter>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD.customer.list[ROOT_PATH]}`} />,
      },
      {
        path: CUSTOMER_TAB_PATH.LIST,
        element: (
          <ProtectedRouter user={user} hasPermission={true}>
            <Customer />
          </ProtectedRouter>
        ),
      },
      {
        path: `:id`,
        element: (
          <ProtectedRouter user={user} hasPermission={customerRole}>
            <CustomerDetail />
          </ProtectedRouter>
        ),
      },
    ],
  };
};

export default useCustomerRoute;

const CustomerDetail = Loadable(lazyWithRetry(() => import("views/CustomerDetail")));
const Customer = Loadable(lazyWithRetry(() => import("views/Customer")));
