import { TRole } from "types/Permission";

export interface TGroupPermission {
  group: string;
  label: string;
  name: string;
  roles: {
    name: string;
    label: string;
    description?: string;
    isShowRadioReadWrite?: boolean;
    isShowRadioRead?: boolean;
    isShowRadioNoPermission?: boolean;
    children?: {
      name: string;
      label: string;
    }[];
    groupByPermission?: {
      readAndWrite: TRole[];
      read: TRole[];
    };
  }[];
}

export type ROLE_TYPE = "READ_AND_WRITE" | "READ" | "NO_PERMISSION";

export const PERMISSION_VALUE: { [key in ROLE_TYPE]: ROLE_TYPE } = {
  READ_AND_WRITE: "READ_AND_WRITE",
  READ: "READ",
  NO_PERMISSION: "NO_PERMISSION",
};

export enum ROLE_TAB {
  ROOT = "root",
  HELP_CENTER = "help-center",
  DASHBOARD = "dashboard",
  SETTINGS = "settings",
  PRODUCT = "product",
  ORDERS = "orders",
  ATTRIBUTE = "attribute",
  PROFILE = "profile",
  GENERAL = "general",
  CUSTOMER = "customer",
  WAREHOUSE = "warehouse",
}

export enum ROLE_DASHBOARD {
  DASHBOARD = "dashboard",
}

export enum ROLE_WAREHOUSE {
  WAREHOUSE = "warehouse",
  IMPORT_SHEET = "import_sheet",
  EXPORT_SHEET = "export_sheet",
  TRANSFER_SHEET = "transfer_sheet",
  CHECK_SHEET = "check_sheet",
  SCAN = "scan",
  INVENTORY = "inventory",
  EXPORT_EXCEL = "export-excel",
  INVENTORY_HISTORY = "inventory-history",
}

export enum ROLE_LEAD {
  ASSIGN_LEAD_FOR_DEPARTMENT = "assign-lead-for-department",
  ASSIGN_LEAD_FOR_TELESALES = "assign-lead-for-telesales",
  LIST = "list",
  CALL_CENTER = "call_center",
  TELESALES = "telesales",
  ASSIGN = "assign_lead_for_telesales",
  EXPORT_EXCEL = "export-excel",
}

export enum ROLE_ORDER {
  HANDLE = "handle",
  CONFIRM = "confirm",
  CANCEL = "cancel",
  REPORT = "report",
  PAYMENT = "payment",
  EXPORT_EXCEL = "export-excel",
}

export enum ROLE_DELIVERY {
  HANDLE = "handle",
  PRINT = "print",
  DELIVERY = "delivery",
  CARE = "care",
}

export enum ROLE_CUSTOMER {
  EXPORT_EXCEL = "export-excel",
  HANDLE = "handle",
}

export enum ROLE_PRODUCT {
  EXPORT_EXCEL = "export-excel",
  HANDLE = "handle",
  VIEW_VARIANT_IMAGE = "products.view_variant_image",
}

export enum ROLE_ATTRIBUTE {
  ROOT = "",
  SETTING = "setting",
  LEAD = "lead",
  ORDER = "order",
  PRODUCT = "product",
  WAREHOUSE = "warehouse",
  CUSTOMER = "customer",
  DELIVERY = "delivery",
}

export enum ROLE_SETTING {
  ACCOUNT = "account",
  ROLE = "role",
  ATTRIBUTE = "attribute",
  ACTIVITY = "activity",
}

export enum ROLE_GENERAL {
  EXPORT_EXCEL = "export-export",
}

export enum ROLE_PROMOTION {
  EXPORT_EXCEL = "export-excel",
  HANDLE = "handle",
}
export enum ROLE_HELP_CENTER {
  ROOT = "root",
  LEAD_CENTER = "lead-center",
  ORDER = "order",
  DELIVERY = "delivery",
  PRODUCT = "product",
  SETTING = "setting",
  WAREHOUSE = "warehouse",
  CUSTOMER = "customer",
}
