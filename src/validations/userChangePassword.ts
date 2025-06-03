import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as Yup from "yup";

export const userChangePasswordSchema = Yup.object()
  .shape({
    newPassword: Yup.string()
      .trim()
      .required(VALIDATION_MESSAGE.REQUIRE_PASSWORD)
      .min(6, VALIDATION_MESSAGE.FORMAT_PASSWORD)
      .max(32, VALIDATION_MESSAGE.FORMAT_PASSWORD),
    confirmNewPassword: Yup.string()
      .trim()
      .required(VALIDATION_MESSAGE.REQUIRE_PASSWORD)
      .min(6, VALIDATION_MESSAGE.FORMAT_PASSWORD)
      .max(32, VALIDATION_MESSAGE.FORMAT_PASSWORD),
  })
  .required();
