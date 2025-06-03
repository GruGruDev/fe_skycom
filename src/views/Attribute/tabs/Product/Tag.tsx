import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { createProductTag } from "store/redux/products/action";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

type Props = {};

const Tag = (_props: Props) => {
  const [state, setState] = useState({
    loading: false,
    error: false,
    type: null,
  });
  const { user } = useAuth();

  const { tags } = useAppSelector(getDraftSafeSelector("product")).attributes;

  const handleCreateTag = async (row: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createProductTag(row);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  // const handleUpdateTag = async (payload: TAttribute) => {
  //   setState((prev) => ({ ...prev, loading: true }));

  // const result = await updateTag(payload);

  // if (result) {
  //   setState((prev) => ({ ...prev, loading: false }));
  // } else {
  //   setState((prev) => ({ ...prev, loading: false, error: true }));
  // }
  // };

  // const handleRemoveTag = async (payload: TAttribute) => {
  //   setState((prev) => ({ ...prev, loading: true }));

  // const result = await removeTag(payload);

  // if (result) {
  //   setState((prev) => ({ ...prev, loading: false }));
  // } else {
  //   setState((prev) => ({ ...prev, loading: false, error: true }));
  // }
  // };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.PRODUCT],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        return <Content row={{ ...row, name: row.tag }} type={"tag"} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "tag",
          label: LABEL.ATTRIBUTE,
          placeholder: LABEL.ATTRIBUTE,
        },
      ]}
      state={state}
      formDefaultData={(row) => ({
        tag: row?.tag,
      })}
      formSchema={(yup) => ({
        tag: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateTag : undefined}
      // handleDeleteAction={isReadAndWriteAttribute?handleRemoveTag:undefined}
      // handleEditAction={isReadAndWriteAttribute?handleUpdateTag:undefined}
      data={tags}
      title={LABEL.PRODUCT_TAG}
      type={"tag"}
    />
  );
};

export default Tag;
