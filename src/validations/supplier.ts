import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as Yup from "yup";

export const supplierSchema = (yup: typeof Yup) => {
  return {
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SUPPLIER),
    business_code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_SUPPLIER_CODE),
  };
};
