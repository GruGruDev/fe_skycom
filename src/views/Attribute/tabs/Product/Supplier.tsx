import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { createSupplier, updateSupplier } from "store/redux/products/action";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

type Props = {};

const Supplier = (_props: Props) => {
  const [state, setState] = useState({
    loading: false,
    type: null,
    error: false,
  });

  const { user } = useAuth();
  const { supplier } = useAppSelector(getDraftSafeSelector("product")).attributes;

  const handleCreateSupplier = async (row: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createSupplier(row);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleActiveSwitch = async (row: TAttribute) => {
    const res = await updateSupplier(row);
    return res;
  };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.PRODUCT],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        return <Content row={row} type={"supplier"} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "supplier",
          label: LABEL.SUPPILER,
          placeholder: LABEL.SUPPILER,
        },
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: "code",
          label: LABEL.BUSINESS_CODE,
          placeholder: LABEL.BUSINESS_CODE,
        },
      ]}
      state={state}
      formSchema={(yup) => ({
        supplier: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ENTERPRISE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateSupplier : undefined}
      handleSwitchAction={isReadAndWriteAttribute ? handleActiveSwitch : undefined}
      data={supplier}
      title={LABEL.SUPPILER}
      type={"supplier"}
    />
  );
};

export default Supplier;
