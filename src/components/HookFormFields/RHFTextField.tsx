import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  formatChangeValue?: (value: string) => string | number;
  formatValue?: (value: string) => string;
}

export function RHFTextField({
  name,
  formatChangeValue,
  formatValue,
  ...other
}: IProps & TextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          defaultValue={field.value}
          value={formatValue ? formatValue(field.value) : field.value}
          onChange={(e) =>
            formatChangeValue
              ? field.onChange(formatChangeValue(e.target.value))
              : field.onChange(e.target.value)
          }
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
