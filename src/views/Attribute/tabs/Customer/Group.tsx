import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { createGroup, removeGroup, updateGroup } from "store/redux/customers/action";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

const Group = () => {
  const [state, setState] = useState({
    loading: false,
    error: false,
    type: null,
  });
  const { user } = useAuth();

  const { groups } = useAppSelector(getDraftSafeSelector("customer")).attributes;

  const handleCreateGroup = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createGroup(payload);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleUpdateGroup = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await updateGroup(payload);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleRemoveGroup = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await removeGroup(payload);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.CUSTOMER],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        return <Content row={{ ...row }} type={"groups"} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "groups",
          label: LABEL.ATTRIBUTE,
          placeholder: LABEL.ATTRIBUTE,
        },
      ]}
      state={state}
      formDefaultData={(row) => ({
        groups: row?.name,
      })}
      formSchema={(yup) => ({
        groups: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateGroup : undefined}
      handleDeleteAction={isReadAndWriteAttribute ? handleRemoveGroup : undefined}
      handleEditAction={isReadAndWriteAttribute ? handleUpdateGroup : undefined}
      data={groups}
      title={LABEL.CUSTOMER_GROUP}
      type={"groups"}
    />
  );
};

export default Group;
