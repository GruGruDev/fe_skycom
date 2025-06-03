import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { TProduct, TVariant } from "types/Product";
import { Shape } from "types/Validation";
import * as Yup from "yup";

export const productSchema = (
  yup: typeof Yup,
  productId?: string,
): { [key in keyof Partial<TProduct>]: Yup.BaseSchema } => {
  return {
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim().nullable(),
    category: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CATEGORY).nullable(),
    SKU_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SKU_CODE).nullable(),
    variants: productId
      ? yup.array().nullable()
      : yup
          .array()
          .of(
            yup
              .object()
              .shape<Shape<Omit<TVariant, "combo_variants">>>({
                name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
                SKU_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SKU_CODE).trim(),
              })
              .required(),
          )
          .required()
          .nullable(),
  };
};
