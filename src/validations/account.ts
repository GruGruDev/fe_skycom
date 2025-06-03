import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as Yup from "yup";

export const accountSchema = Yup.object()
  .shape({
    id: Yup.string(),
    roleId: Yup.string(),
    name: Yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
    email: Yup.string()
      .trim()
      .email(VALIDATION_MESSAGE.FORMAT_EMAIL)
      .required(VALIDATION_MESSAGE.REQUIRE_PHONE),
    phone: Yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim(),
    image: Yup.mixed(),
    role: Yup.string(),
  })
  .required();
