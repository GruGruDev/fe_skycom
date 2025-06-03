import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AttachmentIcon from "@mui/icons-material/Attachment";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import useResponsive from "hooks/useResponsive";
import useToggle from "hooks/useToggle";
import { useState } from "react";
import { TStyles } from "types/Styles";
import KanbanConfirmDialog from "./KanbanConfirmDialog";
// ----------------------------------------------------------------------

type Props = {
  isLike: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onClose: VoidFunction;
  onLike: VoidFunction;
  onAttach: VoidFunction;
  onDelete: VoidFunction;
};

export default function KanbanTaskDetailsToolbar({
  isLike,
  fileInputRef,
  onClose,
  onLike,
  onAttach,
  onDelete,
}: Props) {
  const isDesktop = useResponsive("up", "sm");

  const { toggle: openConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useToggle();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <Stack p={2.5} direction="row" alignItems="center">
      {!isDesktop && (
        <>
          <Tooltip title="Back">
            <IconButton onClick={onClose} sx={{ mr: 1 }}>
              <ArrowBackIosIcon width={20} height={20} />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Stack direction="row" spacing={1} justifyContent="flex-end" flexGrow={1}>
        <Tooltip title="Like this">
          <IconButton color={isLike ? "default" : "primary"} size="small" onClick={onLike}>
            <AutorenewIcon width={20} height={20} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Attachment">
          <IconButton size="small" onClick={onAttach}>
            <AttachmentIcon width={20} height={20} />
          </IconButton>
        </Tooltip>
        <input ref={fileInputRef} type="file" style={styles.input} />

        <Tooltip title="Delete task">
          <IconButton onClick={onOpenConfirm} size="small">
            <DeleteIcon width={20} height={20} />
          </IconButton>
        </Tooltip>

        <KanbanConfirmDialog
          open={openConfirm}
          onClose={onCloseConfirm}
          title={<Typography>Are you sure you want to delete task?</Typography>}
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

        <MoreMenuButton
          open={open}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={<></>}
        />
      </Stack>
    </Stack>
  );
}

const styles: TStyles<"input"> = {
  input: { display: "none" },
};

// ----------------------------------------------------------------------

type MoreMenuButtonProps = {
  actions: React.ReactNode;
  open: HTMLElement | null;
  onClose: VoidFunction;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
};

function MoreMenuButton({ actions, open, onOpen, onClose }: MoreMenuButtonProps) {
  return (
    <>
      <Tooltip title="More actions">
        <IconButton size="small" onClick={onOpen}>
          <MoreHorizIcon width={20} height={20} />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        // arrow="right-top"
        sx={{
          mt: -0.5,
          width: "auto",
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
            "& svg": { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </Popover>
    </>
  );
}
