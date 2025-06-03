import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { GridWrapHeaderProps } from ".";

export default function ActionButton({
  children,
}: { children?: React.ReactNode | JSX.Element } & Partial<GridWrapHeaderProps>) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="Button group with a nested menu">
        <Button onClick={handleToggle}>Action</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        anchorEl={anchorRef.current}
        disablePortal
        onClose={handleClose}
        sx={{ zIndex: 1190 }}
      >
        <Stack p={2} spacing={1}>
          {children}
        </Stack>
      </Popover>
    </React.Fragment>
  );
}
