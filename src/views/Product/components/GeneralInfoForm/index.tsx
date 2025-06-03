import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { RHFTextField } from "components/HookFormFields";
import { Controller } from "react-hook-form";
import { STATUS_PRODUCT_LABEL } from "types/Product";
import UploadImage, { UploadImageProps } from "views/Product/components/UploadImage";
import CategoryModal from "./CategoryModal";
import SupplierModal from "./SupplierModal";
import { PRODUCT_LABEL } from "constants/product/label";

interface Props extends UploadImageProps {
  productId?: string;
}

const GeneralInfoForm = (props: Props) => {
  const { control } = props;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <RHFTextField
            name="name"
            label={PRODUCT_LABEL.name}
            placeholder={PRODUCT_LABEL.input_name}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <RHFTextField
            name="SKU_code"
            label={PRODUCT_LABEL.SKU_code}
            placeholder={PRODUCT_LABEL.SKU_code}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <RHFTextField
            minRows={2}
            name="note"
            label={PRODUCT_LABEL.product_note}
            InputLabelProps={{ shrink: true }}
            placeholder={PRODUCT_LABEL.input_note}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CategoryModal control={control} />
        </Grid>

        <Grid item xs={12} md={6}>
          <SupplierModal control={control} />
        </Grid>
      </Grid>

      <Stack direction="row" alignItems="center" width="100%">
        <Typography component="span" variant="body2">
          {PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive]}
        </Typography>
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              onChange={(_, checked) => field.onChange(!checked)}
              checked={!field.value}
            />
          )}
        />
      </Stack>
      <Box my={2} width="100%">
        <UploadImage {...props} />
      </Box>
    </>
  );
};

export default GeneralInfoForm;
