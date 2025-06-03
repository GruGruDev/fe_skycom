import { TabPanelWrap, TabType } from "components/Tabs";
import ByRole from "../components/PermissionView/ByRole";
import ByFeature from "../components/PermissionView/ByFeature";
import { USER_LABEL } from "constants/user/label";

export const PERMISSION_TABS: TabType[] = [
  { component: <ByRole />, title: "by-role", label: USER_LABEL.role_tab },
  { component: <ByFeature />, title: "by-feature", label: USER_LABEL.feature_tab },
];

const PermissionContainer = () => {
  return <TabPanelWrap tabs={PERMISSION_TABS} tabBodySx={{ width: "100%" }} />;
};

export default PermissionContainer;
