import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { USER_LABEL } from "constants/user/label";
import * as Yup from "yup";

export const userSchema = (yup: typeof Yup, isCreate?: boolean) => {
  return {
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
    email: yup
      .string()
      .trim()
      .email(VALIDATION_MESSAGE.FORMAT_EMAIL)
      .required(VALIDATION_MESSAGE.REQUIRE_EMAIL),
    phone: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim(),
    password:
      isCreate &&
      yup
        .string()
        .trim()
        .required(VALIDATION_MESSAGE.REQUIRE_PASSWORD)
        .min(6, VALIDATION_MESSAGE.FORMAT_PASSWORD)
        .max(32, VALIDATION_MESSAGE.FORMAT_PASSWORD),
    role: yup.string().required(USER_LABEL.select_role_please).nullable(),
    // department: yup.string().required(USER_LABEL.select_department_please),
  };
};
