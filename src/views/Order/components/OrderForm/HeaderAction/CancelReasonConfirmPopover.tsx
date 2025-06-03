import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { MultiSelect } from "components/Selectors";
import { BUTTON } from "constants/button";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import map from "lodash/map";
import { useState } from "react";
import { TAttribute } from "types/Attribute";
import { TSelectOption } from "types/SelectOption";

interface Props {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  handleSubmit: (cancelReasonId: string) => void;
  loading?: boolean;
  cancelReasons?: TAttribute[];
}

function CancelReasonCofirmPopover(props: Props) {
  const { anchorEl, setAnchorEl, handleSubmit, loading, cancelReasons } = props;
  const open = Boolean(anchorEl);
  const id = open ? "attribute-action-popover" : undefined;
  const [cancelReasonId, setCancelReasonId] = useState<string>();
  const [error, setError] = useState<string>();

  const cancelReasonOptions: TSelectOption[] = map(cancelReasons, (item) => {
    const { name = "", id = "" } = item;
    return { label: name, value: id };
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelOrder = () => {
    if (cancelReasonId) {
      handleSubmit(cancelReasonId);
      handleClose();
    } else {
      setError(VALIDATION_MESSAGE.REQUIRE_CANCEL_REASON);
    }
  };

  const handleChangeReason = (reasonId: string) => {
    setCancelReasonId(reasonId);
    setError(undefined);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <div style={styles.wrapContent}>
        <h4 style={styles.title}>{VALIDATION_MESSAGE.REQUIRE_CANCEL_REASON}</h4>
        <DialogContent id="alert-dialog-cancel-order">
          <MultiSelect
            simpleSelect
            options={cancelReasonOptions}
            onChange={(value) => handleChangeReason(value.toString())}
            selectorId="cancel-reason-selector"
            outlined
            placeholder={VALIDATION_MESSAGE.REQUIRE_CANCEL_REASON}
            fullWidth
            error={{ message: error, type: "required" }}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {BUTTON.CANCEL}
          </Button>
          <LoadingButton
            loading={loading}
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
          >
            {BUTTON.CONFIRM}
          </LoadingButton>
        </DialogActions>
      </div>
    </Popover>
  );
}

export default CancelReasonCofirmPopover;

const styles = {
  wrapContent: { padding: "20px 20px 10px 20px" },
  title: { maxWidth: 500 },
};
