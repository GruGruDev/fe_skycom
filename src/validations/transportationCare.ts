import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as yup from "yup";

export const transportationCareSchema = yup
  .object()
  .shape({
    late_reason: yup.string().nullable(),
    late_action: yup
      .string()
      .when("late_reason", {
        is: (late_reason?: string) => !!late_reason,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ACTION).nullable(),
      })
      .nullable(),
    wait_return_reason: yup.string().nullable(),
    wait_return_action: yup
      .string()
      .when("wait_return_reason", {
        is: (wait_return_reason?: string) => !!wait_return_reason,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ACTION).nullable(),
      })
      .nullable(),
    returning_reason: yup.string().nullable(),
    returning_action: yup
      .string()
      .when("returning_reason", {
        is: (returning_reason?: string) => !!returning_reason,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ACTION).nullable(),
      })
      .nullable(),
    returned_reason: yup.string().nullable(),
    returned_action: yup
      .string()
      .when("returned_reason", {
        is: (returned_reason?: string) => !!returned_reason,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ACTION).nullable(),
      })
      .nullable(),
  })
  .required();
