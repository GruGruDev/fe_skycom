import { useContext } from "react";
import { WarehouseContext } from "..";
import SheetContainer from "../containers/SheetContainer";
import { fDateTime } from "utils/date";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";

type Props = {};

const All = (_props: Props) => {
  const context = useContext(WarehouseContext)?.transfer;
  const { user } = useAuth();

  const isRnWTransfer = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
    user,
  ).isReadAndWrite;

  return (
    <SheetContainer
      {...context}
      isAdd
      type="TF"
      isFilterCreator
      isFilterCreatedDate
      isAddSheet={isRnWTransfer}
      isFilterConfimer
      isFilterConfirmDate
      isFilterStatus
      isFilterChangeReason
      isFilterWarehouseFrom
      isFilterWarehouseTo
      typeDisabled
      exportExcel={{ fileName: `Danh-sach-phieu-chuyen-${fDateTime(Date.now())}` }}
    />
  );
};

export default All;
