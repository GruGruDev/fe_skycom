import { ArrowBackIos } from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { SlideTransition } from "components/SlideTransition";
import { SHEET_LABEL } from "constants/warehouse/label";
import { TSheetType } from "types/Sheet";
import ScanContent from "./ScanContent";

interface Props {
  open: boolean;
  handleClose?: () => void;
  type: TSheetType;
}
function ScanModal(props: Props) {
  const { open, handleClose, type } = props;
  const theme = useTheme();

  if (!open) return null;

  return (
    <Dialog
      open={open}
      TransitionComponent={SlideTransition}
      keepMounted
      onClose={handleClose}
      fullScreen
      maxWidth="lg"
      sx={{
        [theme.breakpoints.down("lg")]: {
          "& .MuiDialog-paper": {
            m: 0,
            height: "100%",
          },
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            p: 0,
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "max-content",
              height: "100%",
              color: theme.palette.primary.contrastText,
              pl: 3,
            }}
            onClick={handleClose}
          >
            <ArrowBackIos sx={{ fontSize: "1.5rem" }} />
          </IconButton>
          <Typography sx={{ ...styles.title, color: theme.palette.primary.contrastText }}>
            {type === "IP" ? SHEET_LABEL.import : SHEET_LABEL.export}
          </Typography>
        </DialogTitle>
        {type && <ScanContent open={open} type={type} />}
      </Box>
    </Dialog>
  );
}

export default ScanModal;

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: "350px",
  },
  dialogContent: {
    padding: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    minWidth: 320,
    paddingTop: 4,
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    width: "100%",
    fontWeight: 700,
    fontSize: "1.1rem",
    textAlign: "center",
    py: 3,
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    textTransform: "uppercase",
  },
  button: {
    borderRadius: 8,
    width: "50%",
    fontSize: "1.1rem",
    py: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
