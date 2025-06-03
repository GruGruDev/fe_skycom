import { PageWithTitle } from "components/Page";
import { TabPanelWrap } from "components/Tabs";
import { USER_LABEL } from "constants/user/label";
import { FunctionComponent } from "react";
import General from "views/Profile/tabs/General";

// -------------------------------------------------

const TAB_HEADER_PROFILE = [{ title: "general", label: "Chung", component: <General /> }];

const ProfileView: FunctionComponent = () => {
  return (
    <PageWithTitle title={USER_LABEL.account_info}>
      <TabPanelWrap tabs={TAB_HEADER_PROFILE} tabBodySx={{ width: "100%" }} />
    </PageWithTitle>
  );
};

export default ProfileView;
