import Grid from "@mui/material/Grid";
import { PageWithTitle } from "components/Page";
import { FunctionComponent } from "react";
import { LABEL } from "constants/label";
import Department from "./Department";

const SettingAttribute: FunctionComponent = () => {
  return (
    <PageWithTitle title={LABEL.ATTRIBUTE}>
      <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }} py={4}>
        <Grid xs={12} md={6} item>
          <Department />
        </Grid>
      </Grid>
    </PageWithTitle>
  );
};

export default SettingAttribute;
