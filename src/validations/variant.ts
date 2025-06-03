import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { TVariant } from "types/Product";
import * as Yup from "yup";

export const variantSchema = (
  yup: typeof Yup,
): { [key in keyof Partial<TVariant>]: Yup.BaseSchema } => {
  return {
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).nullable(),
    SKU_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SKU_CODE).nullable(),
    sale_price: yup.number().required(VALIDATION_MESSAGE.REQUIRE_SALE_PRICE).nullable(),
    neo_price: yup.number().nullable(),
    bar_code: yup.string().nullable(),
  };
};
