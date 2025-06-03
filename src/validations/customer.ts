import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as yup from "yup";

export const customerSchema = (customerId?: string) =>
  yup
    .object()
    .shape({
      name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim().nullable(),
      phone: customerId
        ? yup.string().nullable()
        : yup.string().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim(),
      customer_care_staff: yup
        .string()
        .required(VALIDATION_MESSAGE.REQUIRE_CUSTOMER_CARE_STAFF)
        .nullable(),
      birthday: yup.string().required(VALIDATION_MESSAGE.REQUIRE_BIRTHDAY).nullable(),

      address: customerId
        ? yup.object().nullable()
        : yup
            .object({
              address: yup.string().nullable(),
              ward: yup.object({
                // province_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PROVINCE),
                province_id: yup.string().nullable(),
                district_id: yup
                  .string()
                  .when("province_id", {
                    is: (provincesId: string) => !!provincesId,
                    then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
                  })
                  .nullable(),
                ward_id: yup
                  .string()
                  .when("province_id", {
                    is: (provincesId: string) => !!provincesId,
                    then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
                  })
                  .nullable(),
              }),
            })
            .nullable(),
    })
    .required();
