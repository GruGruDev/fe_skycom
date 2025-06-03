import Grid from "@mui/material/Grid";
import { FunctionComponent, useEffect } from "react";
import { getListCustomerAttributes } from "store/redux/customers/action";
import Group from "./Group";
import Tags from "./Tag";
import { LABEL } from "constants/label";
import { PageWithTitle } from "components/Page";
import Rank from "./Rank";

const CustomerAttributes: FunctionComponent = () => {
  useEffect(() => {
    getListCustomerAttributes();
  }, []);

  return (
    <PageWithTitle title={LABEL.ATTRIBUTE}>
      <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }} py={4}>
        <Grid xs={12} md={6} item>
          <Group />
        </Grid>
        <Grid xs={12} md={6} item>
          <Tags />
        </Grid>
        <Grid xs={12} md={6} item>
          <Rank />
        </Grid>
      </Grid>
    </PageWithTitle>
  );
};

export default CustomerAttributes;
