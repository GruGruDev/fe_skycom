import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { YYYY_MM_DD_HH_mm_ss } from "constants/time";
import dayjs from "dayjs";

const VersionView = () => {
  return (
    <Grid container direction="row" sx={{ flexWrap: "wrap" }}>
      <Grid item xs={12}>
        <Typography variant="subtitle2">CI_COMMIT_SHORT_SHA</Typography>:
        <Typography style={titleStyle}>{import.meta.env.REACT_APP_CI_COMMIT_SHORT_SHA}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">CI_COMMIT_TIMESTAMP</Typography>:
        <Typography style={titleStyle}>
          {import.meta.env.REACT_APP_CI_COMMIT_TIMESTAMP
            ? dayjs(new Date(import.meta.env.REACT_APP_CI_COMMIT_TIMESTAMP)).format(
                YYYY_MM_DD_HH_mm_ss,
              )
            : null}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">SENTRY URL</Typography>:
        <a style={labelStyle} href={import.meta.env.REACT_APP_SENTRY_URL}>
          {import.meta.env.REACT_APP_SENTRY_URL}
        </a>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">API URL</Typography>:
        <a style={labelStyle} href={import.meta.env.REACT_APP_API_URL}>
          {import.meta.env.REACT_APP_API_URL}
        </a>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">API REPORT</Typography>:
        <a style={labelStyle} href={import.meta.env.REACT_APP_REPORT_API}>
          {import.meta.env.REACT_APP_REPORT_API}
        </a>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">IMAGE</Typography>:
        <a style={labelStyle} href={import.meta.env.REACT_APP_NGINX_IMAGE}>
          {import.meta.env.REACT_APP_NGINX_IMAGE}
        </a>
      </Grid>
    </Grid>
  );
};

export default VersionView;

const titleStyle = { color: "green", marginLeft: 20 };
const labelStyle = { marginLeft: 20 };
