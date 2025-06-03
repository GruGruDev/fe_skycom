import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Box,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Scrollbar from "components/Scrollbar";
import { Label } from "components/Texts";
import useToggle from "hooks/useToggle";
import { useRef, useState } from "react";
import KanbanContactsDialog from "./KanbanContactsDialog";
import KanbanTaskCommentInput from "./KanbanTaskCommentInput";
import KanbanTaskDetailsToolbar from "./KanbanTaskDetailsToolbar";

// ----------------------------------------------------------------------

const PRIORITIZES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "hight", label: "Hight" },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  width: 140,
  fontSize: 13,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type Props = {
  card: unknown;
  isOpen: boolean;
  onClose: VoidFunction;
  onDeleteTask: VoidFunction;
};

export default function KanbanTaskDetails({ isOpen, onClose, onDeleteTask }: Props) {
  const { toggle: openContacts, onOpen: onOpenContacts, onClose: onCloseContacts } = useToggle();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prioritize, setPrioritize] = useState("low");

  const [like, setLike] = useState(false);

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleLike = () => {
    setLike((prev) => !prev);
  };

  const handleChangePrioritize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrioritize((event.target as HTMLInputElement).value);
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      anchor="right"
      PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}
    >
      <KanbanTaskDetailsToolbar
        fileInputRef={fileInputRef}
        isLike={like}
        onLike={handleLike}
        onAttach={handleAttach}
        onDelete={onDeleteTask}
        onClose={onClose}
      />

      <Divider />

      <Scrollbar>
        <Stack spacing={3} sx={{ px: 2.5, py: 3 }}>
          <OutlinedInput
            fullWidth
            multiline
            size="small"
            placeholder="Task name"
            value={name}
            sx={{
              typography: "h6",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
            }}
          />
          <Stack direction="row">
            <LabelStyle sx={{ mt: 1.5 }}>Assignee</LabelStyle>
            <Stack direction="row" flexWrap="wrap" alignItems="center">
              <Tooltip title="Add assignee">
                <IconButton
                  onClick={onOpenContacts}
                  sx={{ p: 1, ml: 0.5, border: (theme) => `dashed 1px ${theme.palette.divider}` }}
                >
                  <AddBoxIcon width={20} height={20} />
                </IconButton>
              </Tooltip>

              <KanbanContactsDialog open={openContacts} onClose={onCloseContacts} />
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center">
            <LabelStyle> Due date</LabelStyle>
          </Stack>

          <Stack direction="row" alignItems="center">
            <LabelStyle>Prioritize</LabelStyle>
            <RadioGroup row value={prioritize} onChange={handleChangePrioritize}>
              {PRIORITIZES.map((option) => (
                <Box key={option.value} sx={{ position: "relative", mr: 1, lineHeight: 0 }}>
                  <Label
                    variant={option.value === prioritize ? "filled" : "ghost"}
                    color={
                      (option.value === "low" && "info") ||
                      (option.value === "medium" && "warning") ||
                      "error"
                    }
                    startIcon={option.value === prioritize ? <AddBoxIcon /> : null}
                  >
                    {option.label}
                  </Label>

                  <FormControlLabel
                    value={option.value}
                    control={<Radio sx={{ display: "none" }} />}
                    label={null}
                    sx={{
                      m: 0,
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      position: "absolute",
                    }}
                  />
                </Box>
              ))}
            </RadioGroup>
          </Stack>
        </Stack>
      </Scrollbar>

      <Divider />

      <KanbanTaskCommentInput />
    </Drawer>
  );
}
