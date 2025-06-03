import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import useSettings from "../../hooks/useSettings";

// ----------------------------------------------------------------------

export function SettingTableLayout() {
  const { tableLayout, onChangeTableLayout } = useSettings();

  return (
    <ButtonGroup size="small">
      <Button
        onClick={() => onChangeTableLayout("simple")}
        color={tableLayout === "simple" ? "secondary" : "inherit"}
      >
        <TableRowsIcon />
      </Button>
      <Button
        onClick={() => onChangeTableLayout("group")}
        color={tableLayout === "group" ? "secondary" : "inherit"}
      >
        <ViewColumnIcon />
      </Button>
    </ButtonGroup>
  );
}
