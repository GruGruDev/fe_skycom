import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Checkbox,
  ClickAwayListener,
  IconButton,
  OutlinedInput,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import useDateRangePicker from "hooks/useDateRangePicker";
import useToggle from "hooks/useToggle";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { random } from "utils/random";
import KanbanContactsDialog from "./KanbanContactsDialog";
import KanbanDatePickerDialog from "./KanbanDatePickerDialog";
import KanbanTaskDisplayTime from "./KanbanTaskDisplayTime";

// ----------------------------------------------------------------------

const defaultTask = {
  attachments: [],
  comments: [],
  description: "",
  due: [null, null],
  assignee: [],
};

type Props = {
  onAddTask: (task: unknown) => void;
  onCloseAddTask: VoidFunction;
};

export default function KanbanTaskAdd({ onAddTask, onCloseAddTask }: Props) {
  const [name, setName] = useState("");

  const [completed, setCompleted] = useState(false);

  const { toggle: openContacts, onOpen: onOpenContacts, onClose: onCloseContacts } = useToggle();

  const {
    startTime,
    endTime,
    onChangeStartTime,
    onChangeEndTime,
    //
    openPicker,
    onOpenPicker,
    onClosePicker,
    //
    isSameDays,
    isSameMonths,
  } = useDateRangePicker([null, null]);

  const handleKeyUpAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (name.trim() !== "") {
        onAddTask({ ...defaultTask, id: random(36), name, due: [startTime, endTime], completed });
      }
    }
  };

  const handleClickAddTask = () => {
    if (name) {
      onAddTask({ ...defaultTask, id: random(36), name, due: [startTime, endTime], completed });
    }
    onCloseAddTask();
  };

  const handleChangeCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    setCompleted(event.target.checked);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAddTask}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <OutlinedInput
            multiline
            size="small"
            placeholder="Task name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyUp={handleKeyUpAddTask}
            sx={{
              "& input": { p: 0 },
              "& fieldset": { borderColor: "transparent !important" },
            }}
          />

          <Stack direction="row" justifyContent="space-between">
            <Tooltip title="Mark task complete">
              <Checkbox
                disableRipple
                checked={completed}
                onChange={handleChangeCompleted}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<DoneAllIcon />}
              />
            </Tooltip>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Assign this task" onClick={onOpenContacts}>
                <IconButton size="small">
                  <PeopleAltIcon width={20} height={20} />
                </IconButton>
              </Tooltip>

              <KanbanContactsDialog open={openContacts} onClose={onCloseContacts} />

              {startTime && endTime ? (
                <KanbanTaskDisplayTime
                  startTime={startTime}
                  endTime={endTime}
                  isSameDays={isSameDays}
                  isSameMonths={isSameMonths}
                  onOpenPicker={onOpenPicker}
                />
              ) : (
                <Tooltip title="Add due date">
                  <IconButton size="small" onClick={onOpenPicker}>
                    <CalendarMonthIcon width={20} height={20} />
                  </IconButton>
                </Tooltip>
              )}

              <KanbanDatePickerDialog
                open={openPicker}
                startTime={startTime}
                endTime={endTime}
                onChangeStartTime={onChangeStartTime}
                onChangeEndTime={onChangeEndTime}
                onClose={onClosePicker}
              />
            </Stack>
          </Stack>
        </Paper>
      </ClickAwayListener>
    </>
  );
}
