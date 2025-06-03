import { PAGE_TITLE } from "constants/pageTitle";
import {
  ROLE_ATTRIBUTE,
  ROLE_CUSTOMER,
  ROLE_DASHBOARD,
  ROLE_HELP_CENTER,
  ROLE_ORDER,
  ROLE_PRODUCT,
  ROLE_SETTING,
  ROLE_TAB,
  ROLE_WAREHOUSE,
  TGroupPermission,
} from "constants/role";
import { ROOT_PATH } from "types/Router";
import { ROLE_LABEL } from "./label";

export const ROLE_OPTIONS: TGroupPermission[] = [
  {
    group: "General",
    label: PAGE_TITLE.settings[""],
    name: ROLE_TAB.SETTINGS,
    roles: [
      { name: ROLE_SETTING.ACCOUNT, label: PAGE_TITLE.settings.account },
      { name: ROLE_SETTING.ROLE, label: PAGE_TITLE.settings.role },
      {
        name: ROLE_SETTING.ACTIVITY,
        label: PAGE_TITLE.settings.activity,
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Management",
    label: PAGE_TITLE.dashboard,
    name: ROLE_TAB.DASHBOARD,
    roles: [
      { name: ROLE_DASHBOARD.DASHBOARD, label: ROLE_LABEL.dashboard, isShowRadioReadWrite: false },
    ],
  },

  {
    group: "Management",
    label: PAGE_TITLE.orders[""],
    name: ROLE_TAB.ORDERS,
    roles: [
      { name: ROLE_ORDER.HANDLE, label: ROLE_LABEL.handle_order },
      { name: ROLE_ORDER.CONFIRM, label: ROLE_LABEL.confirm, isShowRadioRead: false },
      { name: ROLE_ORDER.CANCEL, label: ROLE_LABEL.cancel_order, isShowRadioRead: false },
      { name: ROLE_ORDER.PAYMENT, label: ROLE_LABEL.payment },
      { name: ROLE_ORDER.REPORT, label: ROLE_LABEL.report, isShowRadioReadWrite: false },
      {
        name: ROLE_ORDER.EXPORT_EXCEL,
        label: ROLE_LABEL.export_excel,
        isShowRadioReadWrite: false,
      },
    ],
  },

  {
    group: "Management",
    label: PAGE_TITLE.product[""],
    name: ROLE_TAB.PRODUCT,
    roles: [
      { name: ROLE_PRODUCT.HANDLE, label: ROLE_LABEL.create_update_product },
      {
        name: ROLE_PRODUCT.EXPORT_EXCEL,
        label: ROLE_LABEL.export_excel,
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Management",
    label: PAGE_TITLE.warehouse[""],
    name: ROLE_TAB.WAREHOUSE,
    roles: [
      { name: ROLE_WAREHOUSE.WAREHOUSE, label: ROLE_LABEL.warehouse },
      { name: ROLE_WAREHOUSE.IMPORT_SHEET, label: ROLE_LABEL.import_sheet },
      { name: ROLE_WAREHOUSE.EXPORT_SHEET, label: ROLE_LABEL.export_sheet },
      { name: ROLE_WAREHOUSE.TRANSFER_SHEET, label: ROLE_LABEL.transfer_sheet },
      { name: ROLE_WAREHOUSE.CHECK_SHEET, label: ROLE_LABEL.check_sheet },
      { name: ROLE_WAREHOUSE.INVENTORY_HISTORY, label: ROLE_LABEL.inventory_history },
      { name: ROLE_WAREHOUSE.SCAN, label: ROLE_LABEL.scan_order, isShowRadioRead: false },
      { name: ROLE_WAREHOUSE.INVENTORY, label: ROLE_LABEL.inventory, isShowRadioReadWrite: false },
      {
        name: ROLE_WAREHOUSE.EXPORT_EXCEL,
        label: ROLE_LABEL.export_excel,
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Management",
    label: PAGE_TITLE.customer[""],
    name: ROLE_TAB.CUSTOMER,
    roles: [
      { name: ROLE_CUSTOMER.HANDLE, label: ROLE_LABEL.create_update_customer },
      {
        name: ROLE_CUSTOMER.EXPORT_EXCEL,
        label: ROLE_LABEL.export_excel,
        isShowRadioReadWrite: false,
      },
    ],
  },

  {
    group: "Management",
    label: PAGE_TITLE["help-center"][ROOT_PATH],
    name: ROLE_TAB.HELP_CENTER,
    roles: [
      {
        name: ROLE_HELP_CENTER.ORDER,
        label: PAGE_TITLE["help-center"].order,
        isShowRadioReadWrite: false,
      },
      {
        name: ROLE_HELP_CENTER.PRODUCT,
        label: PAGE_TITLE["help-center"].product,
        isShowRadioReadWrite: false,
      },
      {
        name: ROLE_HELP_CENTER.SETTING,
        label: PAGE_TITLE["help-center"].setting,
        isShowRadioReadWrite: false,
      },
      {
        name: ROLE_HELP_CENTER.WAREHOUSE,
        label: PAGE_TITLE["help-center"].warehouse,
        isShowRadioReadWrite: false,
      },
      {
        name: ROLE_HELP_CENTER.CUSTOMER,
        label: PAGE_TITLE["help-center"].customer,
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "System",
    label: PAGE_TITLE.attribute[""],
    name: ROLE_TAB.ATTRIBUTE,
    roles: [
      { name: ROLE_ATTRIBUTE.SETTING, label: ROLE_LABEL.setting },
      { name: ROLE_ATTRIBUTE.LEAD, label: ROLE_LABEL.lead_center },
      { name: ROLE_ATTRIBUTE.ORDER, label: ROLE_LABEL.order },
      { name: ROLE_ATTRIBUTE.PRODUCT, label: ROLE_LABEL.product },
      { name: ROLE_ATTRIBUTE.WAREHOUSE, label: ROLE_LABEL.warehouse },
      { name: ROLE_ATTRIBUTE.CUSTOMER, label: ROLE_LABEL.customer },
      { name: ROLE_ATTRIBUTE.DELIVERY, label: ROLE_LABEL.delivery },
    ],
  },
];
