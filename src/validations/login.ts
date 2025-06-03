import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as Yup from "yup";

export const loginSchema = Yup.object()
  .shape({
    email: Yup.string()
      .email(VALIDATION_MESSAGE.FORMAT_EMAIL)
      .required(VALIDATION_MESSAGE.REQUIRE_EMAIL),
    password: Yup.string().required(VALIDATION_MESSAGE.REQUIRE_PASSWORD),
  })
  .required();
