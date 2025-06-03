import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { OPERATORS } from "constants/index";
import { useState } from "react";
import { NumberInputField } from ".";

type Props = {
  onSearch?: (operators: { larger?: OPERATORS; smaller?: OPERATORS }, value: string) => void;
};

const SearchNumberField = (props: Props) => {
  const [input, setInput] = useState("");
  const [operators, setOperators] = useState<{
    larger?: OPERATORS;
    smaller?: OPERATORS;
  }>({
    larger: undefined,
    smaller: undefined,
  });

  const handleToggleLarger = () => {
    setOperators((prev) => ({
      ...prev,
      larger: prev.larger ? undefined : OPERATORS.largerOrEqual,
    }));

    props.onSearch?.(
      { ...operators, larger: operators.larger ? undefined : OPERATORS.largerOrEqual },
      input,
    );
  };

  const handleToggleSmaller = () => {
    setOperators((prev) => ({
      ...prev,
      smaller: prev.smaller ? undefined : OPERATORS.smallerOrEqual,
    }));

    props.onSearch?.(
      { ...operators, smaller: operators.smaller ? undefined : OPERATORS.smallerOrEqual },
      input,
    );
  };

  const handleDoubleClickOperator = (key: keyof typeof operators) => {
    setOperators((prev) => ({ ...prev, [key]: OPERATORS[key] }));
    props.onSearch?.({ ...operators, [key]: OPERATORS[key] }, input);
  };

  const handleChangeInput = (value: string) => {
    setInput(value);
    if (!value) {
      setOperators({ larger: undefined, smaller: undefined });
    }
    props.onSearch?.(value ? operators : { larger: undefined, smaller: undefined }, value);
  };

  return props.onSearch ? (
    <>
      <NumberInputField
        value={parseInt(input)}
        onChange={(value) => handleChangeInput(value ? value.toString() : "")}
        type="currency"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label="ArrowDownwardIcon"
                edge="start"
                style={styles.iconButton}
                sx={{
                  backgroundColor:
                    operators.smaller === OPERATORS.smaller ? "primary.main" : "unset",
                }}
                onClick={handleToggleSmaller}
                onDoubleClick={() => handleDoubleClickOperator("smaller")}
              >
                <ArrowDownwardIcon
                  style={styles.icon}
                  color={
                    operators.smaller === OPERATORS.smallerOrEqual
                      ? "primary"
                      : operators.smaller === OPERATORS.smaller
                        ? "error"
                        : "inherit"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="ArrowUpwardIcon"
                edge="end"
                style={styles.iconButton}
                sx={{
                  backgroundColor: operators.larger === OPERATORS.larger ? "primary.main" : "unset",
                }}
                onClick={handleToggleLarger}
                onDoubleClick={() => handleDoubleClickOperator("larger")}
              >
                <ArrowUpwardIcon
                  style={styles.icon}
                  color={
                    operators.larger === OPERATORS.largerOrEqual
                      ? "primary"
                      : operators.larger === OPERATORS.larger
                        ? "error"
                        : "inherit"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            ".MuiInputBase-input": {
              paddingLeft: 0,
              paddingRight: 0,
              fontSize: "0.9rem !important",
            },
            ".MuiInputAdornment-root": {
              margin: 0,
            },
          },
        }}
      />
    </>
  ) : null;
};

export default SearchNumberField;

const styles = {
  iconButton: { width: 24, height: 24 },
  icon: { fontSize: "1.3rem" },
};
