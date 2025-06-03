import { MDatePicker } from "components/Pickers";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { FieldError } from "react-hook-form";

const BirthdayInput = ({
  value = null,
  onChange,
  error,
}: {
  value?: string | null;
  onChange: (newValue: any) => void;
  error?: FieldError;
}) => {
  return (
    <MDatePicker
      label={CUSTOMER_LABEL.birthday}
      size="medium"
      fullWidth
      disableFuture
      value={value}
      onChange={onChange}
      error={!!error?.message}
      helperText={error?.message}
    />
  );
};

export default BirthdayInput;
