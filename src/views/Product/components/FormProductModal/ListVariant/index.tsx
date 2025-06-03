import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { MButton } from "components/Buttons";
import { INIT_VARIANT } from "constants/product/index";
import { PRODUCT_LABEL } from "constants/product/label";
import map from "lodash/map";
import { Controller, UseFormReturn } from "react-hook-form";
import { TProduct, TVariant } from "types/Product";
import { TStyles } from "types/Styles";
import { random } from "utils/random";
import VariantItem from "./VariantItem";

// -----------------------------------------------------------------

const ListVariant = (props: UseFormReturn<TProduct>) => {
  const { control, watch, setValue } = props;
  const { variants } = watch();

  // variant trong product modal không xử lý hình ảnh
  const handleSubmitPopup = async (form: Partial<TVariant>) => {
    const newVariants = variants?.length
      ? variants.reduce((prevArr: Partial<TVariant>[], current: Partial<TVariant>) => {
          return current.id === form.id ? [...prevArr, form] : [...prevArr, current];
        }, [])
      : [];
    setValue("variants", newVariants, { shouldDirty: true });
    return true;
  };

  return (
    <Grid item xs={12} sm={12} lg={12}>
      <Grid item xs={12} md={12}>
        <Typography variant="body2">{`${PRODUCT_LABEL.create_product_variant}:`}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          {PRODUCT_LABEL.create_variant_des}
        </Typography>
      </Grid>
      <Grid item container xs={12} spacing={2} my={2}>
        <Controller
          name="variants"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <>
                {map(variants, (item, index) => {
                  return (
                    <VariantItem
                      field={field}
                      error={(error as any)?.[index]}
                      variant={item}
                      handleSubmitModal={handleSubmitPopup}
                      key={index}
                      index={index}
                    />
                  );
                })}
              </>
            );
          }}
        />
      </Grid>
      <Grid item container xs={12}>
        <Controller
          name="variants"
          control={control}
          render={({ field }) => {
            const { value = [] } = field;
            return (
              <MButton
                color="primary"
                variant="outlined"
                style={styles.addButton}
                onClick={() => field.onChange([...value, { ...INIT_VARIANT, id: random(6) }])}
              >
                <AddIcon />
              </MButton>
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ListVariant;

const styles: TStyles<"addButton"> = {
  addButton: { height: 28 },
};
