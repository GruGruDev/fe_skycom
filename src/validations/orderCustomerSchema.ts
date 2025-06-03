import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { CUSTOMER_MODAL_ACTION } from "views/Order/components/OrderForm/Customer";
import * as yup from "yup";

export const orderCustomerSchema = yup
  .object()
  .shape({
    formType: yup.string(),
    name: yup.string().required(VALIDATION_MESSAGE.REQUIRE_NAME).trim(),
    phone: yup.string().trim().required(VALIDATION_MESSAGE.REQUIRE_PHONE).trim(),
    address: yup
      .object({
        ward: yup.object({
          province_id: yup.string(),
          district_id: yup.string().when("provinces_id", {
            is: (provinces_id: string) => !!provinces_id,
            then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
          }),
          ward_id: yup.string().when("provinces_id", {
            is: (provinces_id: string) => !!provinces_id,
            then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
          }),
        }),
        address: yup.string().when("ward", {
          is: (ward: {
            district?: string;
            province?: string;
            ward?: string;
            district_id?: string;
            province_id?: string;
            ward_id?: string;
            code?: string;
          }) => !!ward?.province_id,
          then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
        }),
      })
      .when("form", {
        is: (formType: CUSTOMER_MODAL_ACTION) =>
          formType === "create_address" || formType === "update_customer",
        then: yup
          .object({
            ward: yup.object({
              province_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_PROVINCE),
              district_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
              ward_id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
            }),
            street: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ADDRESS).trim(),
          })
          .required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
      }),
  })
  .required();
