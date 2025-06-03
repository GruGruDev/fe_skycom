// material
import Box from "@mui/material/Box";
import { BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

export default function ArrowDownIcon({ ...other }: BoxProps) {
  return (
    <Box {...other}>
      <svg
        style={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="css-1gflh9a"
      ></svg>
    </Box>
  );
}

const styles = {
  icon: { width: "24px" },
};
