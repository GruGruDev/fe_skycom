import { Stack, Paper, Button, Tooltip, OutlinedInput, IconButton } from "@mui/material";
import { MyAvatar } from "components/Images";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AttachmentIcon from "@mui/icons-material/Attachment";

// ----------------------------------------------------------------------

export default function KanbanTaskCommentInput() {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 3, px: 2.5 }}>
      <MyAvatar />

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
        <OutlinedInput
          fullWidth
          multiline
          rows={2}
          placeholder="Type a message"
          sx={{ "& fieldset": { display: "none" } }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Add photo">
              <IconButton size="small">
                <AddAPhotoIcon width={20} height={20} />
              </IconButton>
            </Tooltip>
            <IconButton size="small">
              <AttachmentIcon width={20} height={20} />
            </IconButton>
          </Stack>

          <Button variant="contained">Comment</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
