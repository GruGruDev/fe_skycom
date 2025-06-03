import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { RHFTextField } from "components/HookFormFields";
import { CURRENCY_UNIT } from "constants/index";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { Control, Controller, FieldValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { fNumber } from "utils/number";

interface Props {
  control: Control<FieldValues, object>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

const ComboGeneralInfoForm = (props: Props) => {
  const { control } = props;

  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  return (
    <>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={12} md={3}>
          <RHFTextField
            name="COMBO_name"
            label={`${PRODUCT_LABEL.combo_name} *`}
            placeholder={PRODUCT_LABEL.input_combo}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <RHFTextField
            name="SKU_code"
            label={PRODUCT_LABEL.SKU_code}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <>
          <Grid item xs={12} md={3}>
            <Controller
              name="neo_price"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  defaultValue={field.value}
                  {...field}
                  value={fNumber(field.value)}
                  onChange={(event) => field.onChange(convertValueVnd(event.target.value))}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label={PRODUCT_LABEL.neo_price}
                  placeholder={LABEL.CURRENCY_UNIT}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>
                    ),
                  }}
                  disabled
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Controller
              name="sale_price"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  defaultValue={field.value}
                  {...field}
                  value={fNumber(field.value)}
                  onChange={(event) => field.onChange(convertValueVnd(event.target.value))}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  label={PRODUCT_LABEL.sale_price}
                  placeholder={LABEL.CURRENCY_UNIT}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>
                    ),
                  }}
                  disabled
                />
              )}
            />
          </Grid>
        </>

        <Grid item xs={12}>
          <RHFTextField name="COMBO_note" label={PRODUCT_LABEL.combo_note} multiline minRows={2} />
        </Grid>
      </Grid>
    </>
  );
};

export default ComboGeneralInfoForm;
