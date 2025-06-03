import { useContext } from "react";
import { WarehouseContext } from "..";
import SheetContainer from "../containers/SheetContainer";
import { fDateTime } from "utils/date";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";

type Props = {};

const All = (_props: Props) => {
  const context = useContext(WarehouseContext)?.export;
  const { user } = useAuth();

  const isRnWExport = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
    user,
  ).isReadAndWrite;

  return (
    <SheetContainer
      {...context}
      isAdd
      isScanCode
      type="EP"
      isFilterCreator
      isAddSheet={isRnWExport}
      isFilterCreatedDate
      isFilterConfimer
      isFilterConfirmDate
      isFilterStatus
      isFilterChangeReason
      isFilterWarehouse
      typeDisabled
      exportExcel={{ fileName: `Danh-sach-phieu-xuat-${fDateTime(Date.now())}` }}
    />
  );
};

export default All;
