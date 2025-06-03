import { ROLE_ATTRIBUTE, ROLE_SETTING, ROLE_TAB } from "constants/role";
import {
  CUSTOMER_TAB_PATH,
  HELPCENTER_PATH,
  ORDER_PATH,
  PRODUCT_PATH,
  ROOT_PATH,
  TRouterPath,
  WAREHOUSE_PATH,
} from "types/Router";

export function path(root: string, sublink: string, isRootSymbol?: "symbol") {
  return `${isRootSymbol ? "/" : ""}${root}/${sublink}`;
}

export const PATH_DASHBOARD: TRouterPath = {
  "": path(ROOT_PATH, ""),
  dashboard: path(ROOT_PATH, ROLE_TAB.DASHBOARD),
  profile: path(ROOT_PATH, ROLE_TAB.PROFILE),
  orders: {
    "": path(ROOT_PATH, ROLE_TAB.ORDERS),
    create: path(ROLE_TAB.ORDERS, ORDER_PATH.CREATE),
    list: {
      "": path(ROLE_TAB.ORDERS, ORDER_PATH.LIST),
      draft: path(`${ROLE_TAB.ORDERS}/${ORDER_PATH.LIST}`, ORDER_PATH.DRAFT),
      completed: path(`${ROLE_TAB.ORDERS}/${ORDER_PATH.LIST}`, ORDER_PATH.COMPLETED),
      cancel: path(`${ROLE_TAB.ORDERS}/${ORDER_PATH.LIST}`, ORDER_PATH.CANCEL),
      all: path(`${ROLE_TAB.ORDERS}/${ORDER_PATH.LIST}`, ORDER_PATH.ALL),
    },
    report: {
      "": path(ROLE_TAB.ORDERS, ORDER_PATH.REPORT),
      "report-order": path(`${ROLE_TAB.ORDERS}/${ORDER_PATH.REPORT}`, ORDER_PATH.REPORT_ORDER),
      "report-variant-revenue": path(
        `${ROLE_TAB.ORDERS}/${ORDER_PATH.REPORT}`,
        ORDER_PATH.REPORT_VARIANT_REVENUE,
      ),
      "report-carrier-revenue": path(
        `${ROLE_TAB.ORDERS}/${ORDER_PATH.REPORT}`,
        ORDER_PATH.REPORT_CARRIER_REVENUE,
      ),
    },
  },
  product: {
    "": path(ROOT_PATH, ROLE_TAB.PRODUCT),
    list: {
      "": path(ROLE_TAB.PRODUCT, PRODUCT_PATH.LIST),
      category: path(`${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`, PRODUCT_PATH.CATEGORY),
      "all-product": path(`${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`, PRODUCT_PATH.ALL_PRODUCT),
      "all-variant": path(`${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`, PRODUCT_PATH.ALL_VARIANT),
      "simple-product": path(
        `${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`,
        PRODUCT_PATH.SIMPLE_PRODUCT,
      ),
      "simple-variant": path(
        `${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`,
        PRODUCT_PATH.SIMPLE_VARIANT,
      ),
      material: path(`${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`, PRODUCT_PATH.MATERIAL),
      combo: path(`${ROLE_TAB.PRODUCT}/${PRODUCT_PATH.LIST}`, PRODUCT_PATH.COMBO),
    },
  },

  warehouse: {
    "": path(ROOT_PATH, ROLE_TAB.WAREHOUSE),
    scan: path(`${ROLE_TAB.WAREHOUSE}`, WAREHOUSE_PATH.SCAN),
    inventory: path(`${ROLE_TAB.WAREHOUSE}`, WAREHOUSE_PATH.INVENTORY),
    list: {
      "": path(ROLE_TAB.WAREHOUSE, WAREHOUSE_PATH.LIST),
      all: path(`${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`, WAREHOUSE_PATH.ALL),
      "inventory-history": path(
        `${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`,
        WAREHOUSE_PATH.INVENTORY_HISTORY,
      ),
      "scan-history": path(
        `${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`,
        WAREHOUSE_PATH.SCAN_HISTORY,
      ),
      CK: path(`${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`, WAREHOUSE_PATH.SHEET_CHECKING),
      EP: path(`${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`, WAREHOUSE_PATH.SHEET_EXPORT),
      IP: path(`${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`, WAREHOUSE_PATH.SHEET_IMPORT),
      TF: path(`${ROLE_TAB.WAREHOUSE}/${WAREHOUSE_PATH.LIST}`, WAREHOUSE_PATH.SHEET_TRANSFER),
    },
  },

  customer: {
    "": path(ROOT_PATH, ROLE_TAB.CUSTOMER),
    list: {
      [ROOT_PATH]: path(ROLE_TAB.CUSTOMER, CUSTOMER_TAB_PATH.LIST),
    },
  },

  settings: {
    "": path(ROOT_PATH, ROLE_TAB.SETTINGS),
    account: path(ROLE_TAB.SETTINGS, ROLE_SETTING.ACCOUNT),
    role: path(ROLE_TAB.SETTINGS, ROLE_SETTING.ROLE),
    activity: path(ROLE_TAB.SETTINGS, ROLE_SETTING.ACTIVITY),
  },

  attribute: {
    "": path(ROOT_PATH, ROLE_TAB.ATTRIBUTE),
    order: path(ROLE_TAB.ATTRIBUTE, ROLE_ATTRIBUTE.ORDER),
    product: path(ROLE_TAB.ATTRIBUTE, ROLE_ATTRIBUTE.PRODUCT),
    setting: path(ROLE_TAB.ATTRIBUTE, ROLE_ATTRIBUTE.SETTING),
    warehouse: path(ROLE_TAB.ATTRIBUTE, ROLE_ATTRIBUTE.WAREHOUSE),
    customer: path(ROLE_TAB.ATTRIBUTE, ROLE_ATTRIBUTE.CUSTOMER),
  },
  "help-center": {
    "": path(ROOT_PATH, ROLE_TAB.HELP_CENTER),
    order: path(ROLE_TAB.HELP_CENTER, HELPCENTER_PATH.ORDER),
    product: path(ROLE_TAB.HELP_CENTER, HELPCENTER_PATH.PRODUCT),
    setting: path(ROLE_TAB.HELP_CENTER, HELPCENTER_PATH.SETTING),
    warehouse: path(ROLE_TAB.HELP_CENTER, HELPCENTER_PATH.WAREHOUSE),
    customer: path(ROLE_TAB.HELP_CENTER, HELPCENTER_PATH.CUSTOMER),
  },
};
