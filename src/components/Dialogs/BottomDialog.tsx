import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { BUTTON } from "constants/button";

export interface BottomDialogProps {
  onClose?: () => void;
  loading?: boolean;
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  buttonLabel?: string;
}

export const BottomDialog = ({
  onClose,
  loading,
  onSubmit,
  disabled,
  buttonLabel = BUTTON.ACCEPT,
}: BottomDialogProps) => {
  return (
    <DialogActions style={styles.dialogAction}>
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        {onClose && (
          <Button sx={{ color: "primary.main" }} onClick={onClose}>
            {BUTTON.CLOSE}
          </Button>
        )}
        <LoadingButton variant="contained" disabled={disabled} loading={loading} onClick={onSubmit}>
          {buttonLabel}
        </LoadingButton>
        {/* )} */}
      </Stack>
    </DialogActions>
  );
};

const styles = {
  dialogAction: { padding: "16px 32px" },
};
