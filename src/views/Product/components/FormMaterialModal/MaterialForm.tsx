import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { RHFTextField } from "components/HookFormFields";
import { CURRENCY_UNIT } from "constants/index";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { Controller } from "react-hook-form";
import { STATUS_PRODUCT_LABEL } from "types/Product";
import UploadImage, { UploadImageProps } from "../UploadImage";
import { IMAGE_TYPE } from "types/Media";
import { RHFNumberField } from "components/HookFormFields/RHFNumberField";

/** */

export const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const currencyFieldProps: TextFieldProps = {
  fullWidth: true,
  placeholder: LABEL.CURRENCY_UNIT,
  InputProps: {
    endAdornment: <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>,
  },
  InputLabelProps: { shrink: true },
};

export interface OperationProps extends UploadImageProps {}

const MaterialForm = (props: OperationProps) => {
  const { control } = props;

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <RHFTextField
          name="name"
          label={PRODUCT_LABEL.material_name}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.material_name}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RHFTextField
          name="SKU_code"
          label={PRODUCT_LABEL.SKU_code}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.SKU_code}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RHFTextField
          name="note"
          label={PRODUCT_LABEL.material_note}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.material_note}
          InputProps={undefined}
          minRows={2}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <RHFNumberField size="medium" name="width" fixedDigits={4} label={PRODUCT_LABEL.width} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RHFNumberField size="medium" name="height" fixedDigits={4} label={PRODUCT_LABEL.height} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RHFNumberField size="medium" name="weight" fixedDigits={4} label={PRODUCT_LABEL.weight} />
      </Grid>
      <Grid item xs={12}>
        <UploadImage {...props} variantId={undefined} productId={undefined} type={IMAGE_TYPE.MT} />
      </Grid>

      <Grid item container xs={12} direction="row" alignItems="center">
        <Grid item xs={12} md={3}>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                checked={!field.value}
                onChange={(e) => field.onChange(!e.target.checked)}
              />
            )}
          />
          <Typography component="span" variant="body2">
            {PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive]}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MaterialForm;
