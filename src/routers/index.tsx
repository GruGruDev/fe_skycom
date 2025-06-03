import { Loadable, LoadingScreen } from "components/Loadings";
import useAuth from "hooks/useAuth";
import LogoOnlyLayout from "layout/LogoOnlyLayout";
import { Navigate, useRoutes } from "react-router-dom";
import { lazyWithRetry } from "utils/retryLazyLoad";
import useAttributeRouter from "./useAttributeRouter";
import useCustomerRoute from "./useCustomerRouter";
import useOrderRouter from "./useOrderRouter";
import useProductRouter from "./useProductRouter";
import useSettingRouter from "./useSettingRouter";
import useWarehouseRouter from "./useWarehouseRouter";
import useHelpCenterRouter from "./useHelpCenterRouter";
import useDashboardRouter from "./useDashboardRouter";
import { ROLE_TAB } from "constants/role";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const Router = () => {
  const { user } = useAuth();

  return useRoutes([
    {
      path: "login",
      element: <LoginView />,
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          element: user ? (
            <Navigate to={user?.role?.default_router || ROLE_TAB.DASHBOARD} replace />
          ) : (
            <Box height={"calc(100vh - 100px)"}>
              <LoadingScreen />
            </Box>
          ),
        },
        { path: "version", element: <VersionView /> },
        { path: "profile", element: <ProfileView /> },
        useDashboardRouter(),
        useSettingRouter(),
        useOrderRouter(),
        useAttributeRouter(),
        useProductRouter(),
        useCustomerRoute(),
        useWarehouseRouter(),
        useHelpCenterRouter(),
      ],
    },
    {
      path: "*",
      element: <LogoOnlyLayout />,
      children: [
        { path: "404", element: <NotFoundView /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "terms-of-service",
      element: <TermsOfService />,
    },
    {
      path: "privacy",
      element: <Privacy />,
    },
  ]);
};

const NotFoundView = Loadable(lazyWithRetry(() => import("views/NotFound")));
const VersionView = Loadable(lazyWithRetry(() => import("views/Version")));
const ProfileView = Loadable(lazyWithRetry(() => import("views/Profile")));
const LoginView = Loadable(lazyWithRetry(() => import("views/Login")));
const DashboardLayout = Loadable(lazyWithRetry(() => import("layout")));

const Privacy = Loadable(lazyWithRetry(() => import("views/Privacy")));
const TermsOfService = Loadable(lazyWithRetry(() => import("views/TermOfService")));

export default Router;
