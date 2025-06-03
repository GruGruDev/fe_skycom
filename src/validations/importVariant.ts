import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { VariantDTO } from "types/Product";
import { Shape } from "types/Validation";
import * as yup from "yup";

export const importVariantSchema = yup
  .object()
  .shape<Shape<Partial<VariantDTO>>>({
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
    SKU_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SKU_CODE),
  })
  .required();
