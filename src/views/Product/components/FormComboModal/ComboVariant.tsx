import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { SearchVariantPopover } from "components/Product";
import find from "lodash/find";
import map from "lodash/map";
import reduce from "lodash/reduce";
import sumBy from "lodash/sumBy";
import { memo, useEffect, useMemo } from "react";
import { Controller, ControllerRenderProps, FieldError, UseFormReturn } from "react-hook-form";
import { TVariant, VARIANT_TYPE } from "types/Product";
import ComboVariantItem from "./ComboVariantItem";
import { PRODUCT_LABEL } from "constants/product/label";

// ----------------------------------------------------------

interface Props extends UseFormReturn<TVariant, object> {
  formAction: string;
}

const ComboVariant = memo(
  ({ control, watch, formAction, setValue, formState: { errors } }: Props) => {
    const { combo_variants = [], product } = watch();

    const changeVariant = (
      field: ControllerRenderProps<any, "combo_variants">,
      variant: Partial<TVariant>,
    ) => {
      const { value, onChange } = field;
      const newvariantDetails = reduce(
        value,
        (prevArr: Partial<TVariant>[], current) => {
          return current.id === variant.id
            ? [
                ...prevArr,
                {
                  ...current,
                  ...variant,
                },
              ]
            : [...prevArr, current];
        },
        [],
      );

      onChange(newvariantDetails);
    };

    const handleSelectVariant = (
      field: ControllerRenderProps<any, "combo_variants">,
      arrValue: Partial<TVariant>[],
    ) => {
      const { value, onChange } = field;
      const newvariantDetails = reduce(
        arrValue,
        (prevArr: Partial<TVariant>[], current) => {
          const oldVariant = find(value, (item) => item.id === current.id) || {};

          return [
            ...prevArr,
            {
              ...current,
              quantity: oldVariant.quantity || 1,
              sale_price: oldVariant.sale_price || current.sale_price,
              neo_price: oldVariant.neo_price || current.neo_price,
            },
          ];
        },
        [],
      );

      onChange(newvariantDetails);
    };

    useEffect(() => {
      if (combo_variants.length) {
        const sale_price = sumBy(combo_variants, (item) => {
          const { sale_price = 0, quantity = 0 } = item;
          return +sale_price * +quantity;
        });

        const neo_price = sumBy(combo_variants, (item) => {
          const { neo_price = 0, quantity = 0 } = item;
          return +neo_price * +quantity;
        });
        setValue("sale_price", sale_price, { shouldDirty: true });

        setValue("neo_price", neo_price, { shouldDirty: true });
      }
    }, [combo_variants, setValue]);

    const params = useMemo(
      () => ({ type: VARIANT_TYPE.SIMPLE, product: formAction === "select" ? product : undefined }),
      [product, formAction],
    );

    const disabled = formAction === "select" && !product;

    return (
      <Grid item container xs={12}>
        <Grid item container xs={12} sx={{ mb: 1, mt: 2 }}>
          <Typography variant="body2">{`${PRODUCT_LABEL.select_combo_variant}:`}</Typography>
        </Grid>
        <Grid item container xs={12}>
          <Controller
            name="combo_variants"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <Grid item container lg={12} xs={12} sm={12}>
                    <SearchVariantPopover
                      value={field.value}
                      disabled={disabled}
                      isMultiple
                      limitTags={3}
                      placeholder={PRODUCT_LABEL.search_variant}
                      error={errors.combo_variants as FieldError}
                      params={params}
                      handleSelectVariant={(variants) =>
                        handleSelectVariant(field, variants as Partial<TVariant>[])
                      }
                    />
                  </Grid>
                  {field?.value?.length ? (
                    <Grid item container lg={12} xs={12} sm={12}>
                      {map(field.value, (item, key) => (
                        <ComboVariantItem
                          variant={item}
                          handleChangeVariant={(variant) => changeVariant(field, variant)}
                          isDisableQuantity={disabled}
                          key={key}
                        />
                      ))}
                    </Grid>
                  ) : null}
                </>
              );
            }}
          />
        </Grid>
      </Grid>
    );
  },
);

export default ComboVariant;
