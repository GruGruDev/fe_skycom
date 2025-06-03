import { Theme } from "@mui/material";
import { SxProps } from "@mui/material/styles";
import { GridLineLabel } from "components/Texts";
import { MDatePicker } from "components/Pickers";
import { CUSTOMER_LABEL } from "constants/customer/label";

const BirthdayInput = ({
  value = null,
  onChange,
  sx,
}: {
  value?: string | null;
  onChange: (newValue: any) => void;
  sx?: SxProps<Theme>;
}) => {
  return (
    <GridLineLabel
      containerSx={sx}
      label={`${CUSTOMER_LABEL.birthday}:`}
      value={<MDatePicker size="small" fullWidth disableFuture value={value} onChange={onChange} />}
      displayType="grid"
    />
  );
};

export default BirthdayInput;
