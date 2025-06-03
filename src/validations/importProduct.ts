import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ProductDTO } from "types/Product";
import { Shape } from "types/Validation";
import * as yup from "yup";

export const importProductSchema = yup
  .object()
  .shape<Shape<Partial<ProductDTO>>>({
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME),
  })
  .required();
