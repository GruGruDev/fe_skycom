import { useContext } from "react";
import { WarehouseContext } from "..";
import SheetContainer from "../containers/SheetContainer";
import { fDateTime } from "utils/date";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";

type Props = {};

const All = (_props: Props) => {
  const context = useContext(WarehouseContext)?.import;
  const { user } = useAuth();

  const isRnWImport = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
    user,
  ).isReadAndWrite;

  return (
    <SheetContainer
      {...context}
      isAdd
      isScanCode
      type="IP"
      isFilterCreator
      isFilterCreatedDate
      isFilterConfimer
      isAddSheet={isRnWImport}
      isFilterConfirmDate
      isFilterStatus
      isFilterChangeReason
      isFilterWarehouse
      typeDisabled
      exportExcel={{ fileName: `Danh-sach-phieu-nhap-${fDateTime(Date.now())}` }}
    />
  );
};

export default All;
