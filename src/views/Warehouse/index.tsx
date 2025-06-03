import BallotIcon from "@mui/icons-material/Ballot";
import DownloadIcon from "@mui/icons-material/Download";
import ExposureIcon from "@mui/icons-material/Exposure";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import PublishIcon from "@mui/icons-material/Publish";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { TabRouteWrap } from "components/Tabs";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import { createContext, useEffect } from "react";
import { PATH_DASHBOARD } from "routers/paths";
import { getListInventoryReasons } from "store/redux/warehouses/action";
import { TParams } from "types/Param";
import { ROOT_PATH, TTabRoute } from "types/Router";
import { TUser } from "types/User";
import { checkPermission } from "utils/roleUtils";
import { AllWarehouseContext, useAllWarehouseContext } from "./contexts/All";
import { CheckingSheetContext, useCheckingSheetContext } from "./contexts/Checking";
import { ExportSheetContext, useExportSheetContext } from "./contexts/Export";
import { HistoryWarehouseContext, useHistoryWarehouseContext } from "./contexts/History";
import { ImportSheetContext, useImportSheetContext } from "./contexts/Import";
import { HistoryScanContext, useHistoryScanContext } from "./contexts/ScanHistory";
import { TransferSheetContext, useTransferSheetContext } from "./contexts/Transfer";

const WAREHOUSE_TABS = (user: Partial<TUser> | null): TTabRoute[] => [
  {
    label: PAGE_TITLE.warehouse.list.all,
    path: `/${PATH_DASHBOARD.warehouse.list.all}`,
    icon: <BallotIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE], user)
      .isMatch,
  },
  {
    label: PAGE_TITLE.warehouse.list.IP,
    path: `/${PATH_DASHBOARD.warehouse.list.IP}`,
    icon: <DownloadIcon />,
    roles: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
      user,
    ).isMatch,
  },
  {
    label: PAGE_TITLE.warehouse.list.EP,
    path: `/${PATH_DASHBOARD.warehouse.list.EP}`,
    icon: <PublishIcon />,
    roles: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
      user,
    ).isMatch,
  },
  {
    label: PAGE_TITLE.warehouse.list.TF,
    path: `/${PATH_DASHBOARD.warehouse.list.TF}`,
    icon: <MoveDownIcon />,
    roles: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
      user,
    ).isMatch,
  },
  {
    label: PAGE_TITLE.warehouse.list.CK,
    path: `/${PATH_DASHBOARD.warehouse.list.CK}`,
    icon: <ExposureIcon />,
    roles: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
      user,
    ).isMatch,
  },
  {
    label: PAGE_TITLE.warehouse.list["inventory-history"],
    path: `/${PATH_DASHBOARD.warehouse.list["inventory-history"]}`,
    icon: <WorkHistoryIcon />,
    roles: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.INVENTORY_HISTORY],
      user,
    ).isMatch,
  },
  {
    label: PAGE_TITLE.warehouse.list["scan-history"],
    path: `/${PATH_DASHBOARD.warehouse.list["scan-history"]}`,
    icon: <WorkHistoryIcon />,
    roles: checkPermission(user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.SCAN], user)
      .isMatch,
  },
];

const WarehousePage = () => {
  const { user } = useAuth();
  return (
    <TabRouteWrap routes={WAREHOUSE_TABS(user)} title={`${PAGE_TITLE.warehouse.list[ROOT_PATH]}`} />
  );
};

export interface WarehouseContextType
  extends Partial<
    AllWarehouseContext &
      ImportSheetContext &
      ExportSheetContext &
      CheckingSheetContext &
      TransferSheetContext &
      HistoryWarehouseContext &
      HistoryScanContext & {
        // data: TDGridData<Partial<TWarehouse>>;
        params: TParams;
        setParams: (payload: TParams) => void;
      }
  > {}

export const WarehouseContext = createContext<WarehouseContextType | null>(null);

const Warehouse = () => {
  useEffect(() => {
    getListInventoryReasons();
  }, []);

  return (
    <WarehouseContext.Provider
      value={{
        // data,
        ...useAllWarehouseContext(),
        ...useImportSheetContext(),
        ...useExportSheetContext(),
        ...useTransferSheetContext(),
        ...useCheckingSheetContext(),
        ...useHistoryWarehouseContext(),
        ...useHistoryScanContext(),
      }}
    >
      <WarehousePage />
    </WarehouseContext.Provider>
  );
};

export default Warehouse;
