import { TUser } from "./User";

export enum INSTANCE_NAME {
  User = "User",
  Customer = "Customer",
  CustomerGroup = "CustomerGroup",
  CustomerGroupDetail = "CustomerGroupDetail",
  Order = "Order",
  OrdersPayments = "OrdersPayments",
  Department = "Department",
  Address = "Address",
  ProductCategory = "ProductCategory",
  Product = "Product",
  ProductsVariantsBatches = "ProductsVariantsBatches",
  ProductsVariants = "ProductsVariants",
  Warehouse = "Warehouse",
  WarehouseInventoryAvailable = "WarehouseInventoryAvailable",
  WarehouseSheetCheckDetail = "WarehouseSheetCheckDetail",
}

export enum ACTION_TYPE {
  Create = "Create",
  Read = "Read",
  Update = "Update",
  Delete = "Delete",
  Export = "Export",
  Import = "Import",
  Login = "Login",
  Logout = "Logout",
}

export interface TActivity {
  user: TUser;
  action_time: string;
  action_name: string;
  message: string;
  action_type: ACTION_TYPE;
  instance_id: null;
  instance_name: INSTANCE_NAME;
}
