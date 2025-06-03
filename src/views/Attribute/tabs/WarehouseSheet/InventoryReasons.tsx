import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { SHEET_TYPE_VALUE } from "constants/warehouse";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import {
  createInventoryReason,
  removeInventoryReason,
  updateInventoryReason,
} from "store/redux/warehouses/action";
import { TAttribute } from "types/Attribute";
import { TSheetType } from "types/Sheet";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

const InventoryReasons = ({ type }: { type: TSheetType }) => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    loading: boolean;
    error: boolean;
  }>({ loading: false, error: false });

  const { inventoryReasons } = useAppSelector(getDraftSafeSelector("warehouses"));

  const handleCreateInventoryReason = async (row: TAttribute) => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await createInventoryReason(row);

    if (result) {
      setData((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setData((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleUpdateInventoryReason = async (row: TAttribute) => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await updateInventoryReason(row);

    if (result) {
      setData((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setData((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleRemoveInventoryReason = async (row: TAttribute) => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await removeInventoryReason(row);

    if (result) {
      setData((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setData((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const attributeData = inventoryReasons.filter((item) => item.type === type);

  const reasonLabel = SHEET_TYPE_VALUE[type];

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.WAREHOUSE],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        return <Content row={row} type={type} />;
      }}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: type,
          label: SHEET_LABEL.change_reason,
          placeholder: SHEET_LABEL.change_reason,
        },
      ]}
      state={data}
      formDefaultData={(row) => ({ [type]: row?.name })}
      formSchema={(yup) => ({
        [type]: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateInventoryReason : undefined}
      handleDeleteAction={isReadAndWriteAttribute ? handleRemoveInventoryReason : undefined}
      handleEditAction={isReadAndWriteAttribute ? handleUpdateInventoryReason : undefined}
      data={attributeData}
      title={`${SHEET_LABEL.change_reason} ${reasonLabel}`}
      type={type}
    />
  );
};

export default InventoryReasons;
