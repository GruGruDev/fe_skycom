import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { TStyles } from "types/Styles";

export const ClearAdornment = ({ onClear }: { onClear: () => void }) => {
  return (
    <InputAdornment position="end" className="selector-down-arrow-icon" onClick={onClear}>
      <IconButton style={styles.button}>
        <HighlightOffIcon style={styles.icon} />
      </IconButton>
    </InputAdornment>
  );
};

const styles: TStyles<"button" | "icon"> = {
  button: { padding: 3 },
  icon: { fontSize: "1.3rem" },
};
