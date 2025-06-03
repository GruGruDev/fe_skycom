import Grid from "@mui/material/Grid";
import { NumberInputField } from "components/Fields";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { FieldError } from "react-hook-form";
import { fValueVnd } from "utils/number";

const DiscountInput = ({
  price_discount_input,
  error,
  handleChangeDiscount,
  isEdit,
}: {
  isEdit?: boolean;
  price_discount_input: number;
  handleChangeDiscount: (value: number) => void;
  error?: FieldError;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>{ORDER_LABEL.price_discount_input}</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <NumberInputField
            value={price_discount_input}
            onChange={handleChangeDiscount}
            type="currency"
            error={!!error}
            helperText={error?.message}
            containerSx={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {fValueVnd(price_discount_input)}
          </TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default DiscountInput;
