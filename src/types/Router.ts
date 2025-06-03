import { ROLE_SETTING, ROLE_TAB } from "constants/role";

export const ROOT_PATH = "";

export enum MENU_LEAD_PATH {
  LIST = "list",
  REPORT = "report",
  TELESALES = "telesales",
  CALL_CENTER = "call-center",
  AUTO_ASSIGN = "auto-assign",
}

export enum CUSTOMER_TAB_PATH {
  LIST = "list",
}

export enum LEAD_PATH {
  REPORT_ASSIGN_FOR_TELESALES_BY_CHANNEL = "report-assign-for-telesales-by-channel",
  REPORT_ASSIGN_FOR_DEPARTMENT_BY_CHANNEL = "report-assign-for-department-by-channel",
  AUTO_ASSIGN_FOR_TELESALES = "auto-assign-for-telesales",
  AUTO_ASSIGN_FOR_DEPARTMENT = "auto-assign-for-department",
  CALL_IN = "call-in",
  CALL_OUT = "call-out",
  CALL_MISSED = "call-missed",
  ALL = "all",
  SPAM = "spam",
  HANDLING = "handling",
  PURCHASES = "purchases",
  NO_ORDER = "no-order",
  WAITING = "waiting",
  BAD_DATA = "bad-data",
}

export enum ORDER_PATH {
  CREATE = "create",
  LIST = "list",
  DETAIL = "detail",
  DRAFT = "draft",
  COMPLETED = "completed",
  CANCEL = "cancel",
  ALL = "all",
  ITEM = "item",
  REPORT = "report",
  REPORT_ORDER = "report-order",
  REPORT_VARIANT_REVENUE = "report-variant-revenue",
  REPORT_CARRIER_REVENUE = "report-carrier-revenue",
  REPORT_DETAIL = "report-detail",
}

export enum DELIVERY_PATH {
  LIST = "list",
  ALL = "all",
  PACKING = "packing",
  DELIVERING = "delivering",
  WAITING_FOR_DELIVERY = "waiting_for_delivery",
  RETURN_TRANSPORTING = "return_transporting",
  DELIVERED = "delivered",
  WAITING_TO_RETURN = "waiting_to_return",
  RETURNED = "returned",
  CANCELLED = "cancelled",
  LOST = "lost",
  //
  CARE = "care",
  NEW = "new",
  PENDING = "pending",
  PROCESSING = "processing",
  DONE = "done",
  COMPLETED = "completed",
}

export enum PRODUCT_PATH {
  CATEGORY = "category",
  MATERIAL = "material",
  LIST = "list",
  SIMPLE = "simple",
  SIMPLE_PRODUCT = "simple-product",
  SIMPLE_VARIANT = "simple-variant",
  COMBO = "combo",
  ALL_PRODUCT = "all-product",
  ALL_VARIANT = "all-variant",
}

export enum PROMOTION_PATH {
  CREATE = "create",
  LIST = "list",
  ALL = "all",
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  CANCEL = "cancel",
}

export enum WAREHOUSE_PATH {
  LIST = "list",
  ALL = "all",
  SHEET_IMPORT = "IP",
  SHEET_EXPORT = "EP",
  SHEET_TRANSFER = "TF",
  SHEET_CHECKING = "CK",
  INVENTORY_HISTORY = "inventory-history",
  INVENTORY = "inventory",
  INVENTORY_LOGS = "inventory-logs",
  SHEET = "sheet",
  SCAN_HISTORY = "scan-history",
  SCAN = "scan",
}

export enum ATTRIBUTE_PATH {
  ROOT = "",
  SETTING = "setting",
  LEAD = "lead",
  ORDER = "order",
  PRODUCT = "product",
  WAREHOUSE = "warehouse",
  CUSTOMER = "customer",
  DELIVERY = "delivery",
}

export enum HELPCENTER_PATH {
  ROOT = "",
  SETTING = "setting",
  LEAD = "lead",
  ORDER = "order",
  DELIVERY = "delivery",
  PRODUCT = "product",
  WAREHOUSE = "warehouse",
  CUSTOMER = "customer",
}

export interface TRouterPath {
  [ROOT_PATH]: string;
  [ROLE_TAB.DASHBOARD]: string;
  [ROLE_TAB.PROFILE]: string;
  [ROLE_TAB.ORDERS]: {
    [ROOT_PATH]: string;
    [ORDER_PATH.CREATE]: string;
    [ORDER_PATH.LIST]: {
      [ROOT_PATH]: string;
      [ORDER_PATH.DRAFT]: string;
      [ORDER_PATH.COMPLETED]: string;
      [ORDER_PATH.CANCEL]: string;
      [ORDER_PATH.ALL]: string;
    };
    [ORDER_PATH.REPORT]: {
      [ROOT_PATH]: string;
      [ORDER_PATH.REPORT_ORDER]: string;
      [ORDER_PATH.REPORT_VARIANT_REVENUE]: string;
      [ORDER_PATH.REPORT_CARRIER_REVENUE]: string;
    };
  };

  [ROLE_TAB.PRODUCT]: {
    [ROOT_PATH]: string;
    [PRODUCT_PATH.LIST]: {
      [ROOT_PATH]: string;
      [PRODUCT_PATH.CATEGORY]: string;
      [PRODUCT_PATH.ALL_PRODUCT]: string;
      [PRODUCT_PATH.ALL_VARIANT]: string;
      [PRODUCT_PATH.SIMPLE_PRODUCT]: string;
      [PRODUCT_PATH.SIMPLE_VARIANT]: string;
      [PRODUCT_PATH.MATERIAL]: string;
      [PRODUCT_PATH.COMBO]: string;
    };
  };

  [ROLE_TAB.WAREHOUSE]: {
    [ROOT_PATH]: string;
    [WAREHOUSE_PATH.SCAN]: string;
    [WAREHOUSE_PATH.INVENTORY]: string;
    [WAREHOUSE_PATH.LIST]: {
      [ROOT_PATH]: string;
      [WAREHOUSE_PATH.ALL]: string;
      [WAREHOUSE_PATH.SHEET_IMPORT]: string;
      [WAREHOUSE_PATH.SHEET_EXPORT]: string;
      [WAREHOUSE_PATH.SHEET_TRANSFER]: string;
      [WAREHOUSE_PATH.SHEET_CHECKING]: string;
      [WAREHOUSE_PATH.INVENTORY_HISTORY]: string;
      [WAREHOUSE_PATH.SCAN_HISTORY]: string;
    };
  };
  [ROLE_TAB.CUSTOMER]: {
    [ROOT_PATH]: string;
    [CUSTOMER_TAB_PATH.LIST]: {
      [ROOT_PATH]: string;
    };
  };

  [ROLE_TAB.SETTINGS]: {
    [ROOT_PATH]: string;
    [ROLE_SETTING.ACCOUNT]: string;
    [ROLE_SETTING.ROLE]: string;
    [ROLE_SETTING.ACTIVITY]: string;
  };
  [ROLE_TAB.ATTRIBUTE]: {
    [ROOT_PATH]: string;
    [ATTRIBUTE_PATH.ORDER]: string;
    [ATTRIBUTE_PATH.PRODUCT]: string;
    [ATTRIBUTE_PATH.SETTING]: string;
    [ATTRIBUTE_PATH.CUSTOMER]: string;
    [ATTRIBUTE_PATH.WAREHOUSE]: string;
  };
  [ROLE_TAB.HELP_CENTER]: {
    [ROOT_PATH]: string;
    [HELPCENTER_PATH.ORDER]: string;
    [HELPCENTER_PATH.PRODUCT]: string;
    [HELPCENTER_PATH.SETTING]: string;
    [HELPCENTER_PATH.CUSTOMER]: string;
    [HELPCENTER_PATH.WAREHOUSE]: string;
  };
}

export interface TTabRoute {
  path: string;
  label: React.ReactNode;
  roles?: boolean;
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  title?: string;
}

export interface TRouter {
  path: string;
  component: JSX.Element;
  role?: boolean;
}
