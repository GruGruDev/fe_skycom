import { ACTION_TYPE, INSTANCE_NAME } from "types/Activity";
import { TSelectOption } from "types/SelectOption";
import { ACTIVITY_LABEL } from "./label";

export const ACTION_NAME = {
  CUSTOMERS: "CUSTOMERS",
  USERS: "USERS",
  LOCATIONS: "LOCATIONS",
  PRODUCTS: "PRODUCTS",
  WAREHOUSES: "WAREHOUSES",
  ORDERS: "ORDERS",
  FILES: "FILES",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  EXPORT_FILE: "EXPORT_FILE",
  IMPORT_FILE: "IMPORT_FILE",
};

export const ACTION_NAME_OPTIONS: TSelectOption[] = [
  { label: ACTIVITY_LABEL.users, value: ACTION_NAME.USERS },
  { label: ACTIVITY_LABEL.customers, value: ACTION_NAME.CUSTOMERS },
  { label: ACTIVITY_LABEL.locations, value: ACTION_NAME.LOCATIONS },
  { label: ACTIVITY_LABEL.products, value: ACTION_NAME.PRODUCTS },
  { label: ACTIVITY_LABEL.warehouses, value: ACTION_NAME.WAREHOUSES },
  { label: ACTIVITY_LABEL.orders, value: ACTION_NAME.ORDERS },
  { label: ACTIVITY_LABEL.files, value: ACTION_NAME.FILES },
  { label: ACTIVITY_LABEL.login, value: ACTION_NAME.LOGIN },
  { label: ACTIVITY_LABEL.logout, value: ACTION_NAME.LOGOUT },
  { label: ACTIVITY_LABEL.export_file, value: ACTION_NAME.EXPORT_FILE },
  { label: ACTIVITY_LABEL.import_file, value: ACTION_NAME.IMPORT_FILE },
];

export const ACTION_TYPE_OPTIONS: { value: ACTION_TYPE; label: string }[] = [
  { value: ACTION_TYPE["Create"], label: ACTIVITY_LABEL.create },
  { value: ACTION_TYPE["Read"], label: ACTIVITY_LABEL.read },
  { value: ACTION_TYPE["Update"], label: ACTIVITY_LABEL.update },
  { value: ACTION_TYPE["Delete"], label: ACTIVITY_LABEL.delete },
  { value: ACTION_TYPE["Export"], label: ACTIVITY_LABEL.export },
  { value: ACTION_TYPE["Import"], label: ACTIVITY_LABEL.import },
  { value: ACTION_TYPE["Login"], label: ACTIVITY_LABEL.login },
  { value: ACTION_TYPE["Logout"], label: ACTIVITY_LABEL.logout },
];

export const INSTANCE_NAME_OPTIONS: { value: INSTANCE_NAME; label: string }[] = [
  { value: INSTANCE_NAME["User"], label: ACTIVITY_LABEL.user },
  { value: INSTANCE_NAME["Customer"], label: ACTIVITY_LABEL.customer },
  { value: INSTANCE_NAME["CustomerGroup"], label: ACTIVITY_LABEL.customer_group },
  { value: INSTANCE_NAME["CustomerGroupDetail"], label: ACTIVITY_LABEL.customer_group_detail },
  { value: INSTANCE_NAME["Order"], label: ACTIVITY_LABEL.order },
  { value: INSTANCE_NAME["OrdersPayments"], label: ACTIVITY_LABEL.order_payment },
  { value: INSTANCE_NAME["Department"], label: ACTIVITY_LABEL.department },
  { value: INSTANCE_NAME["Address"], label: ACTIVITY_LABEL.address },
  { value: INSTANCE_NAME["ProductCategory"], label: ACTIVITY_LABEL.product_category },
  { value: INSTANCE_NAME["Product"], label: ACTIVITY_LABEL.product },
  { value: INSTANCE_NAME["ProductsVariantsBatches"], label: ACTIVITY_LABEL.product_variant_batch },
  { value: INSTANCE_NAME["ProductsVariants"], label: ACTIVITY_LABEL.product_variant },
  { value: INSTANCE_NAME["Warehouse"], label: ACTIVITY_LABEL.warehouse },
  {
    value: INSTANCE_NAME["WarehouseInventoryAvailable"],
    label: ACTIVITY_LABEL.warehouse_inventory_available,
  },
  {
    value: INSTANCE_NAME["WarehouseSheetCheckDetail"],
    label: ACTIVITY_LABEL.warehouse_sheet_check_detail,
  },
];
