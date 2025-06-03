import Grid from "@mui/material/Grid";
import { FunctionComponent } from "react";
import CancelReason from "./CancelReason";
import Tag from "./Tag";

const Attributes: FunctionComponent = () => {
  return (
    <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }} py={4}>
      <Grid xs={12} md={6} item>
        <Tag />
      </Grid>
      <Grid xs={12} md={6} item>
        <CancelReason />
      </Grid>
    </Grid>
  );
};

export default Attributes;
