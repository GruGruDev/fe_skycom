import Box from "@mui/material/Box";
import { DateTimePickerProps } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { HH_mm_ss_DD_MM_YYYY } from "constants/time";
import dayjs from "dayjs";
import { forwardRef } from "react";

interface Props extends Omit<DateTimePickerProps<Date>, "value" | "onChange" | "onAccept"> {
  value?: string | null;
  onChange?: (newDate: string) => void;
  onAccept?: (newDate: string) => void;
}

export const MDatetimePicker = forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { value, format = HH_mm_ss_DD_MM_YYYY, onAccept, onChange } = props;

  return (
    <Box className="relative">
      <DateTimePicker
        ref={ref}
        format={format}
        ampm={false}
        slotProps={{ textField: { fullWidth: true } }}
        {...props}
        value={value ? (dayjs(value) as any) : null}
        onChange={(newDate) => onChange?.(dayjs(newDate)?.toString())}
        onAccept={(newDate) => onAccept?.(dayjs(newDate)?.toString())}
      />
    </Box>
  );
});
