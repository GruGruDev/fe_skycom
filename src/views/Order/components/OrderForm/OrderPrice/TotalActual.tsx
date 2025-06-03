import Grid from "@mui/material/Grid";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { fValueVnd } from "utils/number";

const TotalActual = ({ price_total_order_actual }: { price_total_order_actual: number }) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1} mb={2}>
      <Grid item xs={6}>
        <LabelInfo sx={{ fontSize: "1rem", color: "inherit", textTransform: "uppercase" }}>
          {ORDER_LABEL.payment_total_actual}
        </LabelInfo>
      </Grid>
      <Grid item xs={6}>
        <TextInfo
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            width: "100%",
            textAlign: "end",
          }}
        >
          {fValueVnd(price_total_order_actual)}
        </TextInfo>
      </Grid>
    </Grid>
  );
};

export default TotalActual;
