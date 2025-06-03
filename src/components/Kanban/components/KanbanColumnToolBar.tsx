import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  IconButton,
  MenuItem,
  OutlinedInput,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import useToggle from "hooks/useToggle";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import KanbanConfirmDialog from "./KanbanConfirmDialog";

// ----------------------------------------------------------------------

type Props = {
  columnName: string;
  onDelete?: VoidFunction;
  onUpdate?: (name: string) => void;
};

export default function KanbanColumnToolBar({ columnName, onDelete, onUpdate }: Props) {
  const renameRef = useRef<HTMLInputElement>(null);

  const { toggle: openConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useToggle();

  const [value, setValue] = useState(columnName);

  const [open, setOpen] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      if (renameRef.current) {
        renameRef.current.focus();
      }
    }
  }, [open]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleClickRename = () => {
    handleClose();
  };

  const handleChangeColumnName = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleUpdateColumn = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && renameRef.current) {
      renameRef.current.blur();
      onUpdate?.(value);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{
          pt: 3,
          pb: 1,
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 1,
          backgroundColor: "background.neutral",
        }}
      >
        <OutlinedInput
          size="small"
          placeholder="Section name"
          value={value}
          onChange={handleChangeColumnName}
          onKeyUp={handleUpdateColumn}
          inputRef={renameRef}
          disabled={!onUpdate}
          sx={{
            typography: "h6",
            fontWeight: "fontWeightBold",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
          }}
        />

        {(onUpdate || onDelete) && (
          <IconButton size="small" onClick={handleOpen} color={open ? "inherit" : "default"}>
            <AlignHorizontalRightIcon width={20} height={20} />
          </IconButton>
        )}
      </Stack>

      {onUpdate && (
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          sx={{
            width: "auto",
            "& .MuiMenuItem-root": { px: 1, typography: "body2", borderRadius: 0.75 },
          }}
        >
          <MenuItem onClick={onOpenConfirm} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ width: 20, height: 20, flexShrink: 0, mr: 1 }} />
            Delete section
          </MenuItem>

          <MenuItem onClick={handleClickRename}>
            <BorderColorIcon sx={{ width: 20, height: 20, flexShrink: 0, mr: 1 }} />
            Rename section
          </MenuItem>
        </Popover>
      )}

      {onDelete && (
        <KanbanConfirmDialog
          open={openConfirm}
          onClose={onCloseConfirm}
          title={
            <Typography gutterBottom>
              Are you sure you want to delete column <strong>{columnName}</strong>?
            </Typography>
          }
          subheader={
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <strong>NOTE:</strong> All tasks related to this category will also be deleted.
            </Typography>
          }
          actions={
            <>
              <Button variant="outlined" color="inherit" onClick={onCloseConfirm}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            </>
          }
        />
      )}
    </>
  );
}
