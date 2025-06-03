import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { SETTING_LABEL } from "constants/setting/label";
import { USER_LABEL } from "constants/user/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { createDepartment, removeDepartment, updateDepartment } from "store/redux/settings/slice";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

const Department = () => {
  const { user } = useAuth();
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
  }>({ loading: false, error: false });

  const { departments } = useAppSelector(getDraftSafeSelector("settings"));

  const handleCreateDepartment = async (row: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createDepartment(row);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleUpdateDepartment = async (row: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await updateDepartment(row);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleRemoveDepartment = async (row: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await removeDepartment(row);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.SETTING],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        return <Content row={row} type={"department"} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "department",
          label: USER_LABEL.department,
          placeholder: USER_LABEL.department,
        },
      ]}
      state={state}
      formDefaultData={(row) => ({ ["department"]: row?.name })}
      formSchema={(yup) => ({
        ["department"]: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateDepartment : undefined}
      handleDeleteAction={isReadAndWriteAttribute ? handleRemoveDepartment : undefined}
      handleEditAction={isReadAndWriteAttribute ? handleUpdateDepartment : undefined}
      handleSwitchAction={isReadAndWriteAttribute ? handleUpdateDepartment : undefined}
      switchKey="is_receive_lead"
      switchTooltip={SETTING_LABEL.is_receive_lead}
      data={departments}
      title={`${USER_LABEL.department}`}
      type={"department"}
    />
  );
};

export default Department;
