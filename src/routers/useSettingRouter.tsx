import { Loadable } from "components/Loadings";
import { ROLE_SETTING, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import { Navigate } from "react-router-dom";
import { TUser } from "types/User";
import { lazyWithRetry } from "utils/retryLazyLoad";
import ProtectedRouter from "./ProtectedRouter";
import { PATH_DASHBOARD } from "./paths";
import { checkPermission } from "utils/roleUtils";
import { TRouter } from "types/Router";

export const TAB_SETTING_ROUTER = (user: Partial<TUser> | null): TRouter[] => [
  {
    path: ROLE_SETTING.ACCOUNT,
    component: <Account />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ACCOUNT], user)
      .isMatch,
  },
  {
    path: ROLE_SETTING.ROLE,
    component: <Permission />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ROLE], user).isMatch,
  },
  {
    path: ROLE_SETTING.ACTIVITY,
    component: <Activity />,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ACTIVITY], user)
      .isMatch,
  },
];

const useSettingRouter = () => {
  const { user } = useAuth();

  const settingRole = checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS], user).isMatch;

  const fistRoute = (TAB_SETTING_ROUTER(user).find((item) => !!item.role)?.path ||
    ROLE_SETTING.ACCOUNT) as keyof typeof PATH_DASHBOARD.settings;

  return {
    path: ROLE_TAB.SETTINGS,
    element: (
      <ProtectedRouter user={user} hasPermission={settingRole}>
        <SettingView />
      </ProtectedRouter>
    ),
    children: [
      {
        path: "",
        element: <Navigate to={`/${PATH_DASHBOARD.settings[fistRoute]}`} />,
      },
      ...map(TAB_SETTING_ROUTER(user), (item) => ({
        path: item.path,
        element: (
          <ProtectedRouter user={user} hasPermission={item.role}>
            {item.component}
          </ProtectedRouter>
        ),
      })),
    ],
  };
};

export default useSettingRouter;

const SettingView = Loadable(lazyWithRetry(() => import("views/Setting")));

const Account = Loadable(lazyWithRetry(() => import("views/Setting/tabs/Account")));
const Permission = Loadable(lazyWithRetry(() => import("views/Setting/tabs/Permission")));
const Activity = Loadable(lazyWithRetry(() => import("views/Activity")));
