import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import WebIcon from "@mui/icons-material/Web";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { TStyles } from "types/Styles";

export type ToggleHeightProps = {
  style?: React.CSSProperties;
  isFullRow?: boolean;
  setFullRow?: (payload: boolean) => void;
};

export const ToggleHeight = ({ setFullRow, isFullRow, style }: ToggleHeightProps) => {
  return (
    <IconButton
      onClick={() => setFullRow?.(!isFullRow)}
      style={{ ...styles.container, ...style }}
      color={isFullRow ? "primary" : "secondary"}
    >
      {isFullRow ? <WebIcon style={styles.icon} /> : <FormatLineSpacingIcon style={styles.icon} />}
    </IconButton>
  );
};

const styles: TStyles<"container" | "icon"> = {
  container: { width: 50, height: 50, margin: 0, padding: 0 },
  icon: { margin: 5, marginLeft: 10, marginRight: 10 },
};
