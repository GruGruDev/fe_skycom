import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as yup from "yup";

export const phonesSchema = yup
  .object()
  .shape({
    phone: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim(),
  })
  .required();

export const phoneSchema = yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim();
