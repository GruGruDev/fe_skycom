import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import { MBadgeButton } from "components/Buttons";
import { BUTTON } from "constants/button";
import filter from "lodash/filter";
import map from "lodash/map";
import { useState } from "react";
import { TColumn } from "types/DGrid";

export type DVisbleColumnsProps = {
  columns?: TColumn[];
  hiddenColumnDisabled?: string[];
  hiddenColumnNames?: string[];
  setHiddenColumnNames?: (payload: string[]) => void;
};
export const DVisibleColumns = ({
  columns = [],
  hiddenColumnNames = [],
  setHiddenColumnNames,
  hiddenColumnDisabled = [],
}: DVisbleColumnsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onChange = (checked: boolean, columnName: string) => {
    setHiddenColumnNames?.(
      checked
        ? filter(hiddenColumnNames, (item) => item !== columnName)
        : [...hiddenColumnNames, columnName],
    );
  };

  return (
    <>
      {columns.length ? (
        <MBadgeButton
          label={BUTTON.VISIBLE_COLUMNS}
          value={columns.length - hiddenColumnNames.length}
          ref={anchorEl as any}
          setShowPopup={(_, e) => handleClick(e)}
        />
      ) : null}

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
        <List component="nav">
          {map(columns, (column) => (
            <ListItemButton
              key={column.name}
              style={itemStyle}
              disabled={hiddenColumnDisabled.includes(column.name)}
            >
              <ListItemIcon style={itemIconStyle}>
                <Checkbox
                  disabled={hiddenColumnDisabled.includes(column.name)}
                  color="primary"
                  checked={!hiddenColumnNames.includes(column.name)}
                  onChange={(e) => onChange(e.target.checked, column.name)}
                />
              </ListItemIcon>
              <ListItemText primary={column.title} sx={{ span: { fontSize: "0.82rem" } }} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
};

const itemStyle = { padding: "0px 16px 0px 6px", height: 36 };
const itemIconStyle = { margin: 0 };
