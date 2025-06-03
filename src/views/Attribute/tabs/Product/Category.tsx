import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { createCategory } from "store/redux/products/action";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

type Props = {};

const Category = (_props: Props) => {
  const [state, setState] = useState({
    loading: false,
    type: null,
    error: false,
  });

  const { user } = useAuth();
  const { category } = useAppSelector(getDraftSafeSelector("product")).attributes;

  const handleCreateCategory = async (row: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createCategory(row);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  //   const handleUpdateCategory = async (payload: TAttribute) => {
  //     setData((prev) => ({ ...prev, loading: true }));

  //     const result = await updateCategory(payload);

  //     if (result) {
  //       setData((prev) => ({ ...prev, loading: false }));
  //     } else {
  //       setData((prev) => ({ ...prev, loading: false, error: true }));
  //     }
  //   };

  //   const handleRemoveCategory = async (payload: TAttribute) => {
  //     setData((prev) => ({ ...prev, loading: true }));

  //     const result = await removeCategory(payload);

  //     if (result) {
  //       setData((prev) => ({ ...prev, loading: false }));
  //     } else {
  //       setData((prev) => ({ ...prev, loading: false, error: true }));
  //     }
  //   };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.PRODUCT],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        return <Content row={row} type={"category"} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "category",
          label: LABEL.CATEGORY,
          placeholder: LABEL.CATEGORY,
        },
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "code",
          label: LABEL.CATEGORY_CODE,
          placeholder: LABEL.CATEGORY_CODE,
        },
      ]}
      state={state}
      formDefaultData={(row) => ({ category: row?.name, code: row?.code })}
      formSchema={(yup) => ({
        category: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
        code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_GROUP_CODE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateCategory : undefined}
      //   handleDeleteAction={isReadAndWriteAttribute?handleRemoveCategory:undefined}
      //   handleEditAction={isReadAndWriteAttribute?handleUpdateCategory:undefined}
      data={category}
      title={LABEL.CATEGORY}
      type={"category"}
    />
  );
};

export default Category;
