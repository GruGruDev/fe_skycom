import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { BUTTON } from "constants/button";
import { TStyles } from "types/Styles";

interface Props {
  onClose?: () => void;
  loading?: boolean;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  buttonLabel: string;
}

const BottomPanel = ({ onClose, loading, onSubmit, buttonLabel, disabled }: Props) => {
  return (
    <DialogActions style={styles.dialog}>
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        {onClose && (
          <Button color="inherit" onClick={onClose}>
            {BUTTON.CLOSE}
          </Button>
        )}
        <LoadingButton variant="contained" disabled={disabled} loading={loading} onClick={onSubmit}>
          {buttonLabel}
        </LoadingButton>
      </Stack>
    </DialogActions>
  );
};

export default BottomPanel;

const styles: TStyles<"dialog"> = {
  dialog: { padding: 12 },
};
