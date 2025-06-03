import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import useSettings from "../../hooks/useSettings";

// ----------------------------------------------------------------------

export function SettingMode() {
  const { themeMode, onChangeMode } = useSettings();

  return (
    <RadioGroup name="themeMode" value={themeMode} onChange={onChangeMode}>
      <Grid container spacing={2.5} dir="ltr">
        {["light", "dark"].map((mode, index) => (
          <Grid item xs={6} key={mode}>
            <Paper
              sx={{
                width: 1,
                zIndex: 0,
                overflow: "hidden",
                position: "relative",
                bgcolor: mode === "dark" ? "grey.900" : "common.white",
                ...(themeMode === mode && {
                  boxShadow: (theme) => theme.customShadows.z12,
                }),
              }}
            >
              <CardActionArea sx={{ color: "primary.main" }}>
                <Box
                  sx={{
                    py: 4,
                    display: "flex",
                    color: "text.disabled",
                    justifyContent: "center",
                    ...(themeMode === mode && {
                      color: "primary.main",
                    }),
                  }}
                >
                  {index === 0 ? (
                    // eslint-disable-next-line no-inline-styles/no-inline-styles
                    <LightModeIcon style={{ fontSize: "1.6rem" }} />
                  ) : (
                    // eslint-disable-next-line no-inline-styles/no-inline-styles
                    <DarkModeIcon style={{ fontSize: "1.6rem" }} />
                  )}
                </Box>

                <FormControlLabel
                  label=""
                  value={mode}
                  control={<Radio sx={{ display: "none" }} />}
                  sx={{
                    top: 0,
                    margin: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                />
              </CardActionArea>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
}
