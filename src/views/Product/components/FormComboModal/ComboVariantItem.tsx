import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { NumberInputField } from "components/Fields";
import { VariantItem } from "components/Product";
import { CURRENCY_UNIT } from "constants/index";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { TComboVariant } from "types/Product";
import { fNumber } from "utils/number";

const ComboVariantItem = ({
  variant,
  handleChangeVariant,
  isDisableQuantity = false,
}: {
  variant: Partial<TComboVariant>;
  isDisableQuantity?: boolean;
  handleChangeVariant: (variant: Partial<TComboVariant>) => void;
}) => {
  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Grid item xs={6}>
        <VariantItem
          value={variant}
          hiddenColumns={["quantity", "price", "cross_sale", "total", "neo_price", "combo"]}
          isShowStatus
          divider={false}
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          value={fNumber(variant.neo_price)}
          onChange={(event) =>
            handleChangeVariant({
              ...variant,
              neo_price: +convertValueVnd(event.target.value),
            })
          }
          fullWidth
          label={PRODUCT_LABEL.neo_price}
          placeholder={LABEL.CURRENCY_UNIT}
          InputProps={{
            endAdornment: <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>,
          }}
          disabled
        />
      </Grid>
      <Grid item xs={2}>
        <TextField
          value={fNumber(variant.sale_price)}
          onChange={(event) =>
            handleChangeVariant({
              ...variant,
              sale_price: +convertValueVnd(event.target.value),
            })
          }
          fullWidth
          label={PRODUCT_LABEL.sale_price}
          placeholder={LABEL.CURRENCY_UNIT}
          InputProps={{
            endAdornment: <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>,
          }}
          disabled
        />
      </Grid>
      <Grid item xs={2}>
        <NumberInputField
          disabled={isDisableQuantity}
          value={variant.quantity}
          minQuantity={1}
          onChange={(value = 0) => {
            handleChangeVariant({ ...variant, quantity: value });
          }}
          containerStyles={{ marginTop: 8 }}
        />
      </Grid>
    </Grid>
  );
};

export default ComboVariantItem;
