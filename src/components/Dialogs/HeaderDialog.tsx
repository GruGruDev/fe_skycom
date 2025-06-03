import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface Props {
  onClose?: () => void;
  id?: string;
  title: string;
  subTitle?: string;
}

export const HeaderDialog = ({ onClose, title, subTitle }: Props) => {
  return (
    <DialogTitle style={styles.dialogTitle}>
      <Stack>
        <Typography style={styles.label}>{title}</Typography>
        {subTitle && <Typography fontSize={"0.6rem"}>{subTitle}</Typography>}
      </Stack>
      {onClose && (
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const styles = {
  dialogTitle: { padding: "12px 24px", display: "flex", justifyContent: "space-between" },
  label: { fontWeight: 700, lineHeight: 1.55556, fontSize: "1rem" },
};
