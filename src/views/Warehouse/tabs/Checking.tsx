import { useContext } from "react";
import { WarehouseContext } from "..";
import SheetContainer from "../containers/SheetContainer";
import { fDateTime } from "utils/date";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";

type Props = {};

const All = (_props: Props) => {
  const context = useContext(WarehouseContext)?.checking;
  const { user } = useAuth();

  const isRnWCheck = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
    user,
  ).isReadAndWrite;

  return (
    <SheetContainer
      {...context}
      isAdd
      type="CK"
      isFilterCreator
      isFilterCreatedDate
      isFilterConfimer
      isFilterConfirmDate
      isAddSheet={isRnWCheck}
      isFilterStatus
      isFilterChangeReason
      isFilterWarehouse
      typeDisabled
      exportExcel={{ fileName: `Danh-sach-phieu-kiem-${fDateTime(Date.now())}` }}
    />
  );
};

export default All;
