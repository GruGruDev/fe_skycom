import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

export type ToggleTableViewProps = {
  setShowKanbanView?: (value: boolean) => void;
  isKanbanView?: boolean;
};

export const ToggleTableView = ({ isKanbanView, setShowKanbanView }: ToggleTableViewProps) => {
  return setShowKanbanView ? (
    <ButtonGroup
      variant="contained"
      aria-label="Basic button group"
      sx={{
        position: "fixed",
        top: "10%",
        right: 8,
        zIndex: 1330,
        ".MuiButton-root svg": { fontSize: "1.5rem !important" },
      }}
      orientation="vertical"
    >
      <Button
        variant={!isKanbanView ? "contained" : "outlined"}
        onClick={() => setShowKanbanView(false)}
      >
        <TableRowsIcon />
      </Button>
      <Button
        variant={isKanbanView ? "contained" : "outlined"}
        onClick={() => setShowKanbanView(true)}
      >
        <ViewColumnIcon />
      </Button>
    </ButtonGroup>
  ) : null;
};

export default ToggleTableView;
