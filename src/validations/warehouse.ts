import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import * as yup from "yup";
import { addressSchema } from "./address";
import { phoneSchema } from "./phone";

export const warehouseSchema = yup.object().shape({
  manager_phone: phoneSchema,
  name: yup.string().required(WAREHOUSE_LABEL.select_warehouse_please),
  manager_name: yup.string().required(WAREHOUSE_LABEL.select_warehouse_manager),
  address: addressSchema(true),
});
