import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as Yup from "yup";

export const categorySchema = (yup: typeof Yup) => {
  return {
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CATEGORY),
    code: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CATEGORY_CODE),
  };
};
