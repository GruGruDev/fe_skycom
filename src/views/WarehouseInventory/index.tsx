import { WrapPage } from "components/Page";
import Stack from "@mui/material/Stack";
import ProducstInventoryTable from "./components/ProductInventoryTable";
import CategoryInventoryChart from "./components/CategoryInventoryChart";

const WarehouseInventory = () => {
  return (
    <Stack spacing={2}>
      <WrapPage>
        <CategoryInventoryChart />
      </WrapPage>
      <WrapPage>
        <ProducstInventoryTable />
      </WrapPage>
    </Stack>
  );
};

export default WarehouseInventory;
