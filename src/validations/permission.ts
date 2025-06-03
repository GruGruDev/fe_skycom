import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { USER_LABEL } from "constants/user/label";
import * as Yup from "yup";

export const permissionSchema = Yup.object()
  .shape({
    name: Yup.string().required(USER_LABEL.select_permission_please).trim(),
    default_router: Yup.string().required(VALIDATION_MESSAGE.REQUIRE_DIRECT_ROUTER).trim(),
  })
  .required();
