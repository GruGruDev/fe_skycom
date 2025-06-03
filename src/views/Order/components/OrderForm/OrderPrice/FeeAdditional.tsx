import Grid from "@mui/material/Grid";
import { NumberInputField } from "components/Fields";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { fValueVnd } from "utils/number";

const FeeAdditional = ({
  price_addition_input,
  handleChangeAdditionFee,
  isEdit,
}: {
  isEdit?: boolean;
  price_addition_input: number;
  handleChangeAdditionFee: (value: number) => void;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>{ORDER_LABEL.payment_fee_additional}</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <NumberInputField
            containerSx={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
            value={price_addition_input}
            onChange={handleChangeAdditionFee}
            type="currency"
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {fValueVnd(price_addition_input)}
          </TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default FeeAdditional;
