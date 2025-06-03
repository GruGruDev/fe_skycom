import { TRouterPath } from "types/Router";
import { ACTIVITY_LABEL } from "./activity/label";
import { CUSTOMER_LABEL } from "./customer/label";
import { LABEL } from "./label";
import { ORDER_LABEL } from "./order/label";
import { PRODUCT_LABEL } from "./product/label";
import { SETTING_LABEL } from "./setting/label";
import { SHEET_LABEL, WAREHOUSE_LABEL } from "./warehouse/label";

export enum ORDER_PATH_TITLE {
  created = "created",
  list_order = "list_order",
  draft = "draft",
  completed = "completed",
  cancel = "cancel",
  all = "all",
  order = "order",
  report_order = "report_order",
  report_variant_revenue = "report_variant_revenue",
  report_carrier_revenue = "report_carrier_revenue",
}

export enum PRODUCT_PATH_TITLE {
  product = "product",
  category = "category",
  list_product = "list_product",
  "all-product" = "all-product",
  "all-variant" = "all-variant",
  "simple-product" = "simple-product",
  "simple-variant" = "simple-variant",
  material = "material",
}

export enum WAREHOUSE_PATH_TITLE {
  warehouse = "warehouse",
  list_warehouse = "list_warehouse",
  all = "all",
  "inventory-history" = "inventory-history",
  "CK" = "CK",
  "EP" = "EP",
  "IP" = "IP",
  "TF" = "TF",
  "scan" = "scan",
  "inventory" = "inventory",
  "scan-history" = "scan-history",
}

export enum CUSTOMER_PATH_TITLE {
  customer = "customer",
  list_customer = "list_customer",
}

export enum SETTING_PATH_TITLE {
  setting = "setting",
  "account" = "account",
  role = "role",
}

export const PAGE_TITLE: TRouterPath = {
  "": "Skycom",
  dashboard: LABEL.DASHBOARD,
  profile: LABEL.PROFILE,
  orders: {
    "": ORDER_LABEL[ORDER_PATH_TITLE.order],
    create: ORDER_LABEL[ORDER_PATH_TITLE.created],
    list: {
      "": ORDER_LABEL[ORDER_PATH_TITLE.list_order],
      draft: ORDER_LABEL[ORDER_PATH_TITLE.draft],
      completed: ORDER_LABEL[ORDER_PATH_TITLE.completed],
      cancel: ORDER_LABEL[ORDER_PATH_TITLE.cancel],
      all: ORDER_LABEL[ORDER_PATH_TITLE.all],
    },
    report: {
      "": ORDER_LABEL[ORDER_PATH_TITLE.report_order],
      "report-order": ORDER_LABEL[ORDER_PATH_TITLE.report_order],
      "report-variant-revenue": ORDER_LABEL[ORDER_PATH_TITLE.report_variant_revenue],
      "report-carrier-revenue": ORDER_LABEL[ORDER_PATH_TITLE.report_carrier_revenue],
    },
  },
  product: {
    "": PRODUCT_LABEL[PRODUCT_PATH_TITLE.product],
    list: {
      "": PRODUCT_LABEL[PRODUCT_PATH_TITLE.list_product],
      category: PRODUCT_LABEL[PRODUCT_PATH_TITLE.category],
      "all-product": PRODUCT_LABEL[PRODUCT_PATH_TITLE["all-product"]],
      "all-variant": PRODUCT_LABEL[PRODUCT_PATH_TITLE["all-variant"]],
      "simple-product": PRODUCT_LABEL[PRODUCT_PATH_TITLE["simple-product"]],
      "simple-variant": PRODUCT_LABEL[PRODUCT_PATH_TITLE["simple-variant"]],
      material: PRODUCT_LABEL[PRODUCT_PATH_TITLE.material],
      combo: "Combo",
    },
  },

  warehouse: {
    "": WAREHOUSE_LABEL[WAREHOUSE_PATH_TITLE.warehouse],
    scan: SHEET_LABEL[WAREHOUSE_PATH_TITLE.scan],
    inventory: SHEET_LABEL[WAREHOUSE_PATH_TITLE.inventory],
    list: {
      "": WAREHOUSE_LABEL[WAREHOUSE_PATH_TITLE.list_warehouse],
      all: WAREHOUSE_LABEL[WAREHOUSE_PATH_TITLE.all],
      "inventory-history": WAREHOUSE_LABEL[WAREHOUSE_PATH_TITLE["inventory-history"]],
      CK: SHEET_LABEL[WAREHOUSE_PATH_TITLE.CK],
      EP: SHEET_LABEL[WAREHOUSE_PATH_TITLE["EP"]],
      IP: SHEET_LABEL[WAREHOUSE_PATH_TITLE["IP"]],
      TF: SHEET_LABEL[WAREHOUSE_PATH_TITLE["TF"]],
      "scan-history": SHEET_LABEL[WAREHOUSE_PATH_TITLE["scan-history"]],
    },
  },
  customer: {
    "": CUSTOMER_LABEL[CUSTOMER_PATH_TITLE.customer],
    list: {
      "": CUSTOMER_LABEL[CUSTOMER_PATH_TITLE.list_customer],
    },
  },
  settings: {
    "": SETTING_LABEL[SETTING_PATH_TITLE.setting],
    account: SETTING_LABEL[SETTING_PATH_TITLE.account],
    role: SETTING_LABEL[SETTING_PATH_TITLE.role],
    activity: ACTIVITY_LABEL.action_history,
  },
  attribute: {
    "": LABEL.ATTRIBUTE,
    order: ORDER_LABEL[ORDER_PATH_TITLE.order],
    product: PRODUCT_LABEL[PRODUCT_PATH_TITLE.product],
    setting: SETTING_LABEL[SETTING_PATH_TITLE.setting],
    warehouse: WAREHOUSE_LABEL[WAREHOUSE_PATH_TITLE.warehouse],
    customer: CUSTOMER_LABEL[CUSTOMER_PATH_TITLE.customer],
  },
  "help-center": {
    "": "Help Center",
    order: ORDER_LABEL[ORDER_PATH_TITLE.order],
    product: PRODUCT_LABEL[PRODUCT_PATH_TITLE.product],
    setting: SETTING_LABEL[SETTING_PATH_TITLE.setting],
    warehouse: WAREHOUSE_LABEL[WAREHOUSE_PATH_TITLE.warehouse],
    customer: CUSTOMER_LABEL[CUSTOMER_PATH_TITLE.customer],
  },
};
