import Grid from "@mui/material/Grid";
import { NumberInputField } from "components/Fields";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { fValueVnd } from "utils/number";

const FeeDelivery = ({
  price_delivery_input,
  handleChangeShippingFee,
  isEdit,
}: {
  isEdit?: boolean;
  price_delivery_input: number;
  handleChangeShippingFee: (value: number) => void;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>{ORDER_LABEL.price_delivery_input}</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <NumberInputField
            containerSx={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
            value={price_delivery_input}
            onChange={handleChangeShippingFee}
            type="currency"
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {fValueVnd(price_delivery_input)}
          </TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default FeeDelivery;
