import React from "react";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import { TStyles } from "types/Styles";

interface MBadgeButtonProps {
  label: string;
  value: number;
  setShowPopup: (value: boolean, e?: unknown) => void;
  icon?: React.ReactNode;
}

export const MBadgeButton = React.forwardRef(
  (
    { value, setShowPopup, label, icon = <TuneIcon style={styles.badgeIcon} /> }: MBadgeButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <Badge color="error" badgeContent={value} style={styles.button}>
        <Button variant="outlined" onClick={(e) => setShowPopup(true, e)} ref={ref}>
          {icon} {label}
        </Button>
      </Badge>
    );
  },
);

const styles: TStyles<"badgeIcon" | "button"> = {
  badgeIcon: { fontSize: "1.1rem" },
  button: { padding: 0 },
};
