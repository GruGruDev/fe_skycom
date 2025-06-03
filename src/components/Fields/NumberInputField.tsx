import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { SxProps, TextFieldProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { fNumber } from "utils/number";

export type NumberInputFieldProps = {
  value?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onChange?: (value: number) => void;
  onChangeFloat?: (value: string) => void;
  type?: "amount" | "currency" | "percent";
  containerSx?: SxProps<Theme>;
  iconSize?: number;
  containerStyles?: React.CSSProperties;
  step?: number;
  fixedDigits?: number;
} & Omit<TextFieldProps, "onChange">;

export function NumberInputField({
  value = 0,
  fixedDigits,
  minQuantity = 0,
  containerStyles,
  maxQuantity,
  onChangeFloat,
  onChange,
  type = "amount",
  disabled,
  error,
  helperText,
  iconSize = 14,
  step = 1,
  size = "small",
  ...props
}: NumberInputFieldProps) {
  const isType = (typeInput: "amount" | "currency" | "percent") => {
    return type === typeInput;
  };

  return (
    <>
      <Box style={containerStyles}>
        <TextField
          error={error}
          disabled={disabled}
          value={fixedDigits ? value : fNumber(value)}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.-]+/g, "") || "0";
            const floatValue = value?.match(`^\\d+\\.\\d{1,${fixedDigits}}`)?.[0] || value;
            fixedDigits ? onChangeFloat?.(floatValue) : onChange?.(parseInt(value));
          }}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (minQuantity && value < minQuantity) {
              onChangeFloat ? onChangeFloat?.(`${minQuantity}`) : onChange?.(minQuantity);
            }
            if (maxQuantity !== undefined && value > maxQuantity) {
              onChangeFloat ? onChangeFloat?.(`${maxQuantity}`) : onChange?.(maxQuantity);
            }
          }}
          InputProps={{
            startAdornment: isType("amount") ? (
              <IconButton
                size="small"
                color="inherit"
                disabled={value <= minQuantity}
                onClick={() =>
                  fixedDigits
                    ? onChangeFloat?.((value - step).toString())
                    : onChange?.(value - step)
                }
              >
                <RemoveIcon style={{ fontSize: iconSize }} />
              </IconButton>
            ) : undefined,
            endAdornment: isType("amount") ? (
              <IconButton
                size="small"
                color="inherit"
                disabled={maxQuantity != undefined && value >= maxQuantity}
                onClick={() =>
                  fixedDigits
                    ? onChangeFloat?.((parseFloat(value.toString()) + step).toString())
                    : onChange?.(value + step)
                }
              >
                <AddIcon style={{ fontSize: iconSize }} />
              </IconButton>
            ) : undefined,
          }}
          size={size}
          {...props}
        />
      </Box>
      <FormHelperText error={!!helperText}>{helperText}</FormHelperText>
    </>
  );
}
