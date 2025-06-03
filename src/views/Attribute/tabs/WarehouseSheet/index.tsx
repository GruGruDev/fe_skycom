import Grid from "@mui/material/Grid";
import { PageWithTitle } from "components/Page";
import { LABEL } from "constants/label";
import { FunctionComponent, useEffect } from "react";
import { getListInventoryReasons } from "store/redux/warehouses/action";
import InventoryReasons from "./InventoryReasons";

const Attributes: FunctionComponent = () => {
  useEffect(() => {
    getListInventoryReasons();
  }, []);

  return (
    <PageWithTitle title={LABEL.ATTRIBUTE}>
      <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }} py={4}>
        <Grid xs={12} md={6} item>
          <InventoryReasons type="IP" />
        </Grid>
        <Grid xs={12} md={6} item>
          <InventoryReasons type="EP" />
        </Grid>
        <Grid xs={12} md={6} item>
          <InventoryReasons type="TF" />
        </Grid>
        <Grid xs={12} md={6} item>
          <InventoryReasons type="CK" />
        </Grid>
      </Grid>
    </PageWithTitle>
  );
};

export default Attributes;
