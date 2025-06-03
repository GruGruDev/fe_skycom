import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DD_MM_YYYY } from "constants/time";
import dayjs from "dayjs";
import { forwardRef } from "react";

interface Props extends Omit<DatePickerProps<Date>, "onChange" | "onAccept" | "value"> {
  value?: null | string;
  onChange?: (newValue: string) => void;
  onAccept?: (newValue: string) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
}
export const MDatePicker = forwardRef(
  (
    { value = null, onChange, onAccept, format = DD_MM_YYYY, size, ...props }: Props,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <DatePicker
        ref={ref}
        format={format}
        slotProps={{
          textField: {
            fullWidth: true,
            size,
            InputLabelProps: { shrink: true },
            error: props.error,
            helperText: props.helperText,
          },
        }}
        value={value ? (dayjs(value) as any) : null}
        onChange={(newDate) => onChange?.(dayjs(newDate)?.toString())}
        onAccept={(newDate) => onAccept?.(dayjs(newDate)?.toString())}
        {...props}
      />
    );
  },
);
