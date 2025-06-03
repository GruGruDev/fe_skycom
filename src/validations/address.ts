import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import * as yup from "yup";

export const addressSchema = (isRequired?: boolean) =>
  yup.object({
    ward: yup.object({
      province_id: isRequired
        ? yup.string().required(VALIDATION_MESSAGE.REQUIRE_PROVINCE)
        : yup.string(),
      district_id: yup.string().when("province_id", {
        is: (provincesId: string) => !!provincesId,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_DISTRICT),
      }),
      ward_id: yup.string().when("province_id", {
        is: (provincesId: string) => !!provincesId,
        then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_WARD),
      }),
    }),
    address: yup.string().when("ward.province_id", {
      is: (provincesId: string) => !!provincesId,
      then: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
    }),
  });
