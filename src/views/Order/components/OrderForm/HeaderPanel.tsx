//components
import Stack from "@mui/material/Stack";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";

//icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TStyles } from "types/Styles";

interface Props {
  onClose?: () => void;
  id?: string;
  title: string;
}

const HeaderPanel = ({ onClose, title }: Props) => {
  return (
    <DialogTitle style={styles.dialogTitle}>
      <Stack direction="row" alignItems="center">
        {onClose && (
          <IconButton onClick={onClose} style={styles.iconButton}>
            <ChevronRightIcon />
          </IconButton>
        )}
        <Title>{title}</Title>
      </Stack>
      {onClose && (
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export default HeaderPanel;

const Title = styled(Typography)(() => ({
  fontWeight: 700,
  lineHeight: 1.55556,
  fontSize: "1.1rem",
}));

const styles: TStyles<"iconButton" | "dialogTitle"> = {
  iconButton: { marginRight: 8 },
  dialogTitle: { padding: "8px 24px", display: "flex", justifyContent: "space-between" },
};
