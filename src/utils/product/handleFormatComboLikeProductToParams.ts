import map from "lodash/map";
import { ComboVariantDTO, VARIANT_TYPE } from "types/Product";

export const handleFormatComboLikeProductToParams = (form: ComboVariantDTO) => {
  const {
    SKU_code,
    bar_code,
    category,
    name,
    note,
    is_active,
    supplier,
    tags,
    COMBO_name,
    COMBO_note,
  } = form;

  let newVariant: Partial<ComboVariantDTO> = {
    name: COMBO_name,
    note: COMBO_note,
    SKU_code,
    bar_code,
    tags,
    is_active,
    type: VARIANT_TYPE.COMBO,
  };

  const comboVariants = map(form?.combo_variants, (item) => {
    const { id, quantity = 0, sale_price = 0, neo_price = 0 } = item;
    newVariant.sale_price = (newVariant.sale_price || 0) + sale_price * quantity;
    newVariant.neo_price = (newVariant.neo_price || 0) + neo_price * quantity;
    return {
      detail_variant_id: id,
      quantity: quantity,
      price_detail_variant: sale_price,
    };
  });

  newVariant = {
    ...newVariant,
    combo_variants: comboVariants?.length ? comboVariants : [],
  };

  const params: Partial<ComboVariantDTO> = {
    name,
    note,
    tags,
    variants: [newVariant],
    category,
    supplier,
  };
  return params;
};
