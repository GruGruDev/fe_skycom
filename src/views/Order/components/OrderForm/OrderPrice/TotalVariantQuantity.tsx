import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { fValueVnd } from "utils/number";

const TotalVariantQuantity = ({
  price_total_variant_actual,
  price_total_variant_actual_input,
  price_total_variant_all,
}: {
  price_total_variant_all: number;
  price_total_variant_actual: number;
  price_total_variant_actual_input: number;
}) => {
  return (
    <Grid ml={0} container display="flex" alignItems="center">
      <Grid item xs={6}>
        <LabelInfo>{`${ORDER_LABEL.price_total_variant_actual}`}</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="row" alignItems="center" justifyContent={"flex-end"}>
          {price_total_variant_all !== price_total_variant_actual && (
            <TextInfo
              sx={{
                fontWeight: 400,
                fontSize: "0.82rem",
                textDecoration: "line-through",
                marginRight: 1,
              }}
            >
              {fValueVnd(price_total_variant_all)}
            </TextInfo>
          )}
          <Stack>
            {/* <TextInfo sx={{ fontWeight: 700 }}>{fValueVnd(price_total_variant_actual)}</TextInfo> */}
            <TextInfo sx={{ fontWeight: 700, color: "error.main" }}>
              {fValueVnd(price_total_variant_actual_input)}
            </TextInfo>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TotalVariantQuantity;
