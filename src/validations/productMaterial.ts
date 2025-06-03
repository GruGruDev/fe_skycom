import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { TProductMaterial } from "types/Product";
import * as Yup from "yup";

export const productMaterialSchema = (
  yup: typeof Yup,
): { [key in keyof Partial<TProductMaterial>]: Yup.BaseSchema } => {
  return {
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).nullable(),
    SKU_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SKU_CODE).nullable(),
    weight: yup.string().nullable(),
  };
};
