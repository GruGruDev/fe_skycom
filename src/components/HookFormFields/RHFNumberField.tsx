import { NumberInputField, NumberInputFieldProps } from "components/Fields";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

export function RHFNumberField(props: Partial<NumberInputFieldProps> & { name: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <NumberInputField
            fullWidth
            value={field.value}
            onChange={props.fixedDigits ? undefined : field.onChange}
            error={!!error}
            helperText={error?.message}
            onChangeFloat={props.fixedDigits ? field.onChange : undefined}
            {...props}
          />
        );
      }}
    />
  );
}
