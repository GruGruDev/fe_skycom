import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { warehouseApi } from "apis/warehouse";
import { PageWithTitle } from "components/Page";
import { TabPanelWrap, TabType } from "components/Tabs";
import { WrapperSection } from "components/Texts";
import { LABEL } from "constants/label";
import { INVENTORY_LOG_LABEL, WAREHOUSE_LABEL } from "constants/warehouse/label";
import { createContext, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListInventoryReasons } from "store/redux/warehouses/action";
import { TParams } from "types/Param";
import { TWarehouse } from "types/Warehouse";
import WarehouseInfomation from "./components/WarehouseInfomation";
import { InventoryContext, useInventoryContext } from "./contexts/Inventory";
import { LogsContext, useLogsContext } from "./contexts/Logs";
import Inventory from "./tabs/Inventory";
import Logs from "./tabs/Logs";

export const WAREHOUSE_TAB = (): TabType[] => [
  { component: <Inventory />, title: "Inventory", label: INVENTORY_LOG_LABEL.inventory },
  { component: <Logs />, title: "Logs", label: LABEL.HISTORY },
];

const WarehouseDetailPage = () => {
  const { id } = useParams();

  const [data, setData] = useState<TWarehouse>();
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    if (id) {
      setLoading(true);
      const res = await warehouseApi.getById<TWarehouse>({ endpoint: `${id}/` });
      if (res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <PageWithTitle title={WAREHOUSE_LABEL.warehouse_details}>
      <Paper variant="elevation" elevation={3} style={styles.paper}>
        <Typography fontSize={"1rem"} fontWeight="600" marginBottom={2}>
          {data?.name}
        </Typography>
        <WarehouseInfomation data={data} loading={loading} />
      </Paper>
      <WrapperSection containerSx={{ marginTop: "32px", marginBottom: "32px", paddingTop: "0px" }}>
        <TabPanelWrap tabs={WAREHOUSE_TAB()} tabBodySx={{ width: "100%" }} />
      </WrapperSection>
    </PageWithTitle>
  );
};

export type WarehouseDetailContextType = Partial<
  InventoryContext &
    LogsContext & {
      params: TParams;
      setParams: (payload: TParams) => void;
    }
> | null;

export const WarehouseDetailContext = createContext<WarehouseDetailContextType>(null);

const WarehouseDetail = () => {
  const [params, setParams] = useState<TParams>({ limit: 30, page: 1 });

  useEffect(() => {
    getListInventoryReasons();
  }, []);

  return (
    <WarehouseDetailContext.Provider
      value={{
        params,
        setParams,
        ...useInventoryContext(),
        ...useLogsContext(),
      }}
    >
      <WarehouseDetailPage />
    </WarehouseDetailContext.Provider>
  );
};

export default WarehouseDetail;

const styles = {
  paper: { padding: 32, marginTop: 32 },
};
