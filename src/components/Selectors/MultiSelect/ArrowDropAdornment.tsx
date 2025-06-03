import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TStyles } from "types/Styles";

export const ArrowDropAdornment = () => {
  return (
    <InputAdornment position="end" className="selector-down-arrow-icon">
      <IconButton style={styles.button}>
        <ArrowDropDownIcon style={styles.icon} />
      </IconButton>
    </InputAdornment>
  );
};

const styles: TStyles<"button" | "icon"> = {
  button: { padding: 0 },
  icon: { fontSize: "1.6rem" },
};
