import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { createCustomerTag } from "store/redux/customers/action";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

const Tag = () => {
  const [state, setState] = useState({
    loading: false,
    error: false,
    type: null,
  });
  const { user } = useAuth();

  const { tags } = useAppSelector(getDraftSafeSelector("customer")).attributes;

  const handleCreateTags = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createCustomerTag(payload);

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
        return <Content row={{ ...row }} type={"tags"} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "tags",
          label: LABEL.ATTRIBUTE,
          placeholder: LABEL.ATTRIBUTE,
        },
      ]}
      state={state}
      formDefaultData={(row) => ({
        tags: row?.name,
      })}
      formSchema={(yup) => ({
        tags: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateTags : undefined}
      // handleDeleteAction={isReadAndWriteAttribute ? handleRemoveTag:undefined}
      // handleEditAction={isReadAndWriteAttribute ? handleUpdateTag:undefined}
      data={tags}
      title={LABEL.CUSTOMER_TAG}
      type={"tags"}
    />
  );
};

export default Tag;
