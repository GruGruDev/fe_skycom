import KeyIcon from "@mui/icons-material/Key";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { PageWithTitle } from "components/Page";
import { TabRouteWrap } from "components/Tabs";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_SETTING, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { PATH_DASHBOARD } from "routers/paths";
import { TTabRoute } from "types/Router";
import { TUser } from "types/User";
import { checkPermission } from "utils/roleUtils";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";

// ---------------------------------------------

export const SETTING_TABS = (user: Partial<TUser> | null): TTabRoute[] => [
  {
    label: PAGE_TITLE.settings.account,
    path: `/${PATH_DASHBOARD.settings.account}`,
    icon: <ManageAccountsIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ACCOUNT], user)
      .isMatch,
  },
  {
    path: `/${PATH_DASHBOARD.settings.role}`,
    label: PAGE_TITLE.settings.role,
    icon: <KeyIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ROLE], user)
      .isMatch,
  },
  {
    path: `/${PATH_DASHBOARD.settings.activity}`,
    label: PAGE_TITLE.settings.activity,
    icon: <YoutubeSearchedForIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ACTIVITY], user)
      .isMatch,
  },
];

const SettingContainer = () => {
  const { user } = useAuth();

  return <TabRouteWrap routes={SETTING_TABS(user)} />;
};

const SettingView = () => {
  return (
    <PageWithTitle title={PAGE_TITLE.settings[""]}>
      <SettingContainer />
    </PageWithTitle>
  );
};

export default SettingView;
