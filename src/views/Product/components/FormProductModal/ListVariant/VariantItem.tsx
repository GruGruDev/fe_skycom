import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { CURRENCY_UNIT } from "constants/index";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import filter from "lodash/filter";
import { useState } from "react";
import { ControllerRenderProps, FieldErrors } from "react-hook-form";
import { TProduct, TVariant, VariantDTO } from "types/Product";
import { fNumber } from "utils/number";
import { FormVariantModal } from "../../FormVariantModal";

// -----------------------------------------------------------------

export const VariantItem = ({
  variant,
  field,
  error,
  handleSubmitModal,
  index,
}: {
  variant: Partial<TVariant>;
  field: ControllerRenderProps<TProduct, "variants">;
  error?: FieldErrors<TVariant>;
  handleSubmitModal: (form: Partial<TVariant>) => void;
  index: number;
}) => {
  const { value: variants, onChange } = field;

  const [variantModal, setVariantModal] = useState(false);

  const handleChangeInput = (key: keyof TVariant, value?: TVariant[keyof TVariant]) => {
    const variantClones = [...variants];
    variantClones[index] = {
      ...variantClones[index],
      [key]: value,
    };

    onChange(variantClones);
  };

  const convertValueVnd = (value: string) => {
    return value.replace(/,/gi, "");
  };

  const handleClose = () => {
    setVariantModal(false);
  };

  const handleOpenPopup = () => {
    setVariantModal(true);
  };

  const handleSubmitVariant = async (form: Partial<VariantDTO>) => {
    const newVariant = { ...variant, ...form };
    handleSubmitModal(newVariant as TVariant);
    handleClose();
    return newVariant as VariantDTO;
  };

  return (
    <>
      <FormVariantModal
        open={variantModal}
        row={variant}
        handleSubmitModal={handleSubmitVariant}
        onClose={() => setVariantModal(false)}
      />
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12} md={5}>
          <TextField
            value={variant.name}
            fullWidth
            label={PRODUCT_LABEL.variant_name}
            required
            error={!!error?.name}
            helperText={error?.name?.message}
            onChange={(e) => handleChangeInput("name", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            value={variant.SKU_code}
            fullWidth
            label="SKU"
            error={!!error?.SKU_code?.message}
            helperText={error?.SKU_code?.message}
            onChange={(e) => handleChangeInput("SKU_code", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            value={fNumber(variant.neo_price)}
            fullWidth
            label={PRODUCT_LABEL.neo_price}
            placeholder={LABEL.CURRENCY_UNIT}
            InputProps={{
              endAdornment: <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>,
            }}
            onChange={(e) => handleChangeInput("neo_price", +convertValueVnd(e.target.value))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            value={fNumber(variant.sale_price)}
            fullWidth
            label={PRODUCT_LABEL.sale_price}
            placeholder={LABEL.CURRENCY_UNIT}
            error={!!error?.sale_price?.message}
            helperText={error?.sale_price?.message}
            InputProps={{
              endAdornment: <InputAdornment position="end">{CURRENCY_UNIT.VND}</InputAdornment>,
            }}
            onChange={(e) => handleChangeInput("sale_price", +convertValueVnd(e.target.value))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item container alignItems="center" xs={12} md={1}>
          <IconButton color="info" onClick={handleOpenPopup}>
            <EditIcon />
          </IconButton>
          {variants?.length > 1 ? (
            <IconButton
              color="error"
              onClick={() => onChange(filter(variants, (item) => item.id !== variant.id))}
            >
              <DeleteIcon />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default VariantItem;
