import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import { BUTTON } from "constants/button";
import { LABEL } from "constants/label";
import React from "react";
import { TAttribute } from "types/Attribute";
import { TStyles } from "types/Styles";

interface Props {
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleRefresh?: () => void;
  attribute?: TAttribute;
  labelDialog?: string;
  status: { loading: boolean; error?: boolean };
  style?: React.CSSProperties;
  type?: "label" | "icon";
}

export const EditAndDeletePopover = ({ type = "icon", ...props }: Props) => {
  const {
    handleDelete,
    handleEdit,
    handleRefresh,
    attribute,
    labelDialog = LABEL.CONFIRMED_REMOVE,
    status,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "attribute-action-popover" : undefined;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid style={props.style}>
      {handleEdit &&
        (type === "icon" ? (
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={handleEdit}
            disabled={attribute?.disable}
          >
            <EditIcon style={styles.icon} />
          </IconButton>
        ) : (
          <Button sx={{ color: "secondary.main" }} size="small" onClick={handleEdit}>
            {BUTTON.UPDATE}
          </Button>
        ))}
      {handleDelete &&
        (type === "icon" ? (
          <IconButton
            color="error"
            aria-label="upload picture"
            component="span"
            onClick={handleClick}
          >
            <DeleteIcon style={styles.icon} />
          </IconButton>
        ) : (
          <Button sx={{ color: "error.main" }} size="small" onClick={handleClick}>
            {BUTTON.DELETE}
          </Button>
        ))}
      {handleRefresh && (
        <Tooltip title="Refresh">
          <IconButton onClick={handleClick}>
            {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
            <RefreshIcon style={{ fontSize: "1.5rem" }} />
          </IconButton>
        </Tooltip>
      )}
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
        <div style={styles.wrapper}>
          <h4 style={styles.title}>{labelDialog}</h4>
          <DialogContentText id="alert-dialog-slide-description">
            {attribute?.name}
          </DialogContentText>
          <Divider />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {BUTTON.CANCEL}
            </Button>
            <LoadingButton
              loading={status.loading}
              onClick={(_e) => {
                handleDelete && handleDelete();
                handleRefresh && handleRefresh();
                handleClose();
              }}
              color="error"
              variant="contained"
            >
              {BUTTON.DELETE}
            </LoadingButton>
          </DialogActions>
        </div>
      </Popover>
    </Grid>
  );
};

const styles: TStyles<"wrapper" | "title" | "icon"> = {
  wrapper: { padding: "20px 20px 10px 20px" },
  title: { maxWidth: 500 },
  icon: { fontSize: "1.5rem" },
};
