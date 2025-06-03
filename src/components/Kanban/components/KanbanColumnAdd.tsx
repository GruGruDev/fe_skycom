import AddIcon from "@mui/icons-material/Add";
import { Button, ClickAwayListener, OutlinedInput, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { createColumn } from "../utils";

// ----------------------------------------------------------------------

export default function KanbanColumnAdd() {
  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreateColumn = async () => {
    try {
      if (name) {
        createColumn({ name });
        setName("");
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCreateColumn();
    }
  };

  return (
    <Paper sx={{ minWidth: 280, width: 280 }}>
      {!open && (
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<AddIcon width={20} height={20} />}
          onClick={handleOpen}
        >
          Add section
        </Button>
      )}

      {open && (
        <ClickAwayListener onClickAway={handleCreateColumn}>
          <OutlinedInput
            fullWidth
            placeholder="New section"
            inputRef={nameRef}
            value={name}
            onChange={handleChangeName}
            onKeyUp={handleKeyUp}
            sx={{ typography: "h6" }}
          />
        </ClickAwayListener>
      )}
    </Paper>
  );
}
