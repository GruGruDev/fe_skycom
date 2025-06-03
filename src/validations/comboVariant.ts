import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ComboVariantDTO } from "types/Product";
import * as Yup from "yup";

export const comboVariantSchema = (
  yup: typeof Yup,
  isCreateProduct?: boolean,
): { [key in keyof Partial<ComboVariantDTO>]: Yup.BaseSchema } => {
  return {
    product: isCreateProduct
      ? yup.string()
      : yup.string().required(VALIDATION_MESSAGE.SELECT_PRODUCT),
    name: isCreateProduct
      ? yup.string().required(VALIDATION_MESSAGE.SELECT_PRODUCT).trim()
      : yup.string().trim(),
    category: isCreateProduct
      ? yup.string().required(VALIDATION_MESSAGE.REQUIRE_CATEGORY)
      : yup.string(),
    COMBO_name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
    SKU_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SKU_CODE).trim(),
    sale_price: yup.number().required(),
    neo_price: yup.number().required(),
    combo_variants: yup
      .array()
      .when("product", {
        is: (product?: { id: string }) => !product?.id,
        then: yup
          .array()
          .min(2, VALIDATION_MESSAGE.SELECT_PRODUCT)
          .required(VALIDATION_MESSAGE.SELECT_PRODUCT),
      })
      .min(2, VALIDATION_MESSAGE.REQUIRE_MIN_2_PRODUCT)
      .required(VALIDATION_MESSAGE.REQUIRE_MIN_2_PRODUCT),
  };
};
