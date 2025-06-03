import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SHEET_LABEL } from "constants/warehouse/label";
import { TStyles } from "types/Styles";
import ScanContent from "views/Warehouse/components/modals/ScanModal/ScanContent";

type Props = {};

const WarehouseScan = ({}: Props) => {
  return (
    <Box style={styles.container}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          p: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Typography fontSize="1.5rem" style={styles.title}>
          {SHEET_LABEL.export}
        </Typography>
      </DialogTitle>
      <ScanContent open type={"EP"} />
    </Box>
  );
};

export default WarehouseScan;

const styles: TStyles<"container" | "title"> = {
  container: {
    height: "90%",
  },
  title: {
    width: "100%",
    fontWeight: 700,
    fontSize: "1.1rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    textTransform: "uppercase",
    padding: "1rem 0rem",
    color: "#fff",
  },
};
