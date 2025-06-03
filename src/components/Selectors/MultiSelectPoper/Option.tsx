import Checkbox from "@mui/material/Checkbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { findOption } from "utils/option";

interface Props {
  option: TSelectOption;
  onChange: (option: TSelectOption) => void;
  preSelect: TSelectOption[];
  simpleSelect?: boolean;
  fullWidth?: boolean;
  renderOptionTitle?: ({ onClick }: { onClick?: () => void }) => React.ReactNode;
  style?: React.CSSProperties;
}

export const Option = ({
  option,
  preSelect,
  simpleSelect,
  fullWidth,
  renderOptionTitle,
  onChange,
  style,
}: Props) => {
  const selected = !!findOption(preSelect, option.value, "value");

  return (
    <ListItemButton
      key={option.value}
      dense
      selected={selected}
      onClick={() => onChange(option)}
      style={{
        backgroundColor: selected && simpleSelect ? "rgb(25, 60, 234,0.1)" : undefined,
        padding: simpleSelect ? 3 : 0,
        ...styles.itemButton,
        ...style,
      }}
      disabled={option.disabled}
    >
      {!simpleSelect && (
        <ListItemIcon style={styles.itemIcon}>
          <Checkbox edge="start" checked={selected} />
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          (renderOptionTitle &&
            renderOptionTitle({
              onClick: option.disabled ? () => onChange(option) : undefined,
            })) ||
          option.label
        }
        style={{
          whiteSpace: fullWidth ? "normal" : option.label.length < 40 ? "nowrap" : "break-spaces",
          ...styles.itemText,
        }}
      />
    </ListItemButton>
  );
};

const styles: TStyles<"itemText" | "itemIcon" | "itemButton"> = {
  itemText: { paddingLeft: 4 },
  itemIcon: { margin: 0 },
  itemButton: { marginBottom: 2, paddingLeft: 10, paddingRight: 10 },
};
