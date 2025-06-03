import { styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { TagField } from "components/Fields";
import { RHFTextField } from "components/HookFormFields";
import { CURRENCY_UNIT } from "constants/index";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import reduce from "lodash/reduce";
import { Controller } from "react-hook-form";
import { TAttribute } from "types/Attribute";
import { STATUS_PRODUCT_LABEL, VARIANT_TYPE } from "types/Product";
import { fNumber } from "utils/number";
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

const VariantForm = (props: OperationProps) => {
  const { tags } = useAppSelector(getDraftSafeSelector("product")).attributes;
  const { control, formState, productId, setValue, watch } = props;

  const { commission, commission_percent, id } = watch?.() || {};

  const { type } = formState?.defaultValues || {};

  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  const onChangeCommission = (value: string) => {
    if (value === "commission") {
      setValue?.("commission", 0, { shouldDirty: true });
      setValue?.("commission_percent", null, { shouldDirty: true });
    } else {
      setValue?.("commission", null, { shouldDirty: true });
      setValue?.("commission_percent", 0, { shouldDirty: true });
    }
  };

  const isComboVariant = type === VARIANT_TYPE.COMBO;

  const tagOptions = reduce(
    tags,
    (prev: TAttribute[], item) => {
      return [...prev, { id: item.id, name: item.name || item.tag }];
    },
    [],
  );

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <RHFTextField
          name="name"
          label={PRODUCT_LABEL.variant_name}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.variant_name}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RHFTextField
          name="SKU_code"
          label={PRODUCT_LABEL.SKU_code}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.input_SKU}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RHFTextField
          name="bar_code"
          label={PRODUCT_LABEL.bar_code}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.input_bar_code}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField
          name="neo_price"
          disabled={isComboVariant}
          formatValue={fNumber}
          formatChangeValue={(value) => parseInt(convertValueVnd(value))}
          label={PRODUCT_LABEL.neo_price}
          {...currencyFieldProps}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          name="sale_price"
          disabled={isComboVariant}
          formatValue={fNumber}
          formatChangeValue={(value) => parseInt(convertValueVnd(value))}
          label={PRODUCT_LABEL.sale_price}
          {...currencyFieldProps}
        />
      </Grid>
      <Grid item xs={12}>
        <RHFTextField
          name="note"
          label={PRODUCT_LABEL.variant_note}
          {...currencyFieldProps}
          placeholder={PRODUCT_LABEL.variant_note}
          InputProps={undefined}
          minRows={2}
        />
      </Grid>
      {!id && (
        <Grid item xs={12} sm={6}>
          <RHFTextField
            name="inventory_quantity"
            formatValue={fNumber}
            label={PRODUCT_LABEL.inventory_quantity}
          />
        </Grid>
      )}
      {!id && (
        <Grid item xs={12} sm={6}>
          <RHFTextField
            name="inventory_note"
            label={PRODUCT_LABEL.inventory_note}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography fontSize={"0.825rem"}>{PRODUCT_LABEL.commission}</Typography>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{ ml: 2 }}
            onChange={(_e, value) => onChangeCommission(value)}
          >
            <FormControlLabel
              sx={{ span: { fontSize: "0.825rem !important" } }}
              value="commission"
              checked={commission != null && commission != undefined}
              control={<Radio />}
              label={PRODUCT_LABEL.commission}
            />
            <FormControlLabel
              sx={{ span: { fontSize: "0.825rem !important" } }}
              value="commission_percent"
              checked={commission_percent != null && commission_percent != undefined}
              control={<Radio />}
              label={PRODUCT_LABEL.commission_percent}
            />
          </RadioGroup>
        </Stack>
        {commission != undefined && (
          <RHFNumberField
            size="medium"
            name="commission"
            label={PRODUCT_LABEL.commission}
            type="currency"
          />
        )}
        {commission_percent != undefined && (
          <RHFNumberField
            size="medium"
            fixedDigits={2}
            name="commission_percent"
            label={PRODUCT_LABEL.commission_percent}
            maxQuantity={100}
            minQuantity={0}
          />
        )}
      </Grid>
      {productId && (
        <Grid item xs={12}>
          <UploadImage {...props} productId={undefined} type={IMAGE_TYPE.PDV} />
        </Grid>
      )}
      <Grid item xs={12}>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => {
            return (
              <TagField
                options={tagOptions}
                placeholder={LABEL.TAG}
                onSubmit={field.onChange}
                value={field.value}
                returnType="id"
              />
            );
          }}
        />
      </Grid>
      <Grid item container xs={12} direction="row" alignItems="center">
        <Grid item xs={12} md={8}>
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

export default VariantForm;
