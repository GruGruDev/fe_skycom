import map from "lodash/map";
import { ComboVariantDTO, TVariant, VARIANT_TYPE } from "types/Product";

export const handleFormatComboLikeVariantToParams = (form: ComboVariantDTO) => {
  const { SKU_code, bar_code, is_active, product, COMBO_name, COMBO_note, images } = form;

  let newCombo: Partial<TVariant> = {
    name: COMBO_name,
    note: COMBO_note,
    SKU_code,
    bar_code,
    is_active,
    type: VARIANT_TYPE.COMBO,
  };

  const imageIds = images?.map((item) => item?.id || "");

  const comboVariants = map(form?.combo_variants, (item) => {
    const { id, quantity = 0, sale_price = 0, neo_price = 0 } = item;
    newCombo.sale_price = (newCombo.sale_price || 0) + sale_price * quantity;
    newCombo.neo_price = (newCombo.neo_price || 0) + neo_price * quantity;
    return {
      detail_variant_id: id,
      quantity,
      price_detail_variant: sale_price || 0,
    };
  });

  const params = {
    ...newCombo,
    product_id: product,
    combo_variants: comboVariants,
    images: imageIds,
  };
  return params;
};
