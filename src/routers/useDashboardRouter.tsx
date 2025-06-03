import { Loadable } from "components/Loadings";
import { ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { lazyWithRetry } from "utils/retryLazyLoad";
import { checkPermission } from "utils/roleUtils";
import ProtectedRouter from "./ProtectedRouter";

const useDashboardRouter = () => {
  const { user } = useAuth();

  const isControlDashboard = checkPermission(user?.role?.data?.[ROLE_TAB.DASHBOARD], user).isMatch;

  return {
    path: ROLE_TAB.DASHBOARD,
    element: (
      <ProtectedRouter user={user} hasPermission={isControlDashboard}>
        <DashboardView />
      </ProtectedRouter>
    ),
  };
};

export default useDashboardRouter;

const DashboardView = Loadable(lazyWithRetry(() => import("views/Dashboard")));
