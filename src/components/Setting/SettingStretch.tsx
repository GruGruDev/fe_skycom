import Paper from "@mui/material/Paper";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import useSettings from "../../hooks/useSettings";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// ----------------------------------------------------------------------

export function SettingStretch() {
  const { themeStretch, onToggleStretch } = useSettings();

  return (
    <CardActionArea sx={{ color: "primary.main", borderRadius: 1 }}>
      <Paper
        onClick={onToggleStretch}
        sx={{
          p: 2.5,
          bgcolor: "background.neutral",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 1,
            mx: "auto",
            width: 0.5,
            height: 40,
            borderRadius: 1,
            color: "action.active",
            bgcolor: "background.default",
            transition: (theme) => theme.transitions.create("width"),
            boxShadow: (theme) => theme.customShadows.z12,
            ...(themeStretch && {
              width: 1,
              color: "primary.main",
            }),
          }}
        >
          {themeStretch ? (
            <ArrowBackIosIcon style={styles.icon} />
          ) : (
            <ArrowForwardIosIcon style={styles.icon} />
          )}
          {themeStretch ? (
            <ArrowForwardIosIcon style={styles.icon} />
          ) : (
            <ArrowBackIosIcon style={styles.icon} />
          )}
        </Stack>
      </Paper>
    </CardActionArea>
  );
}

const styles = {
  icon: { fontSize: "1rem" },
};
