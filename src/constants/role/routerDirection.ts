import { PAGE_TITLE } from "constants/pageTitle";
import { PATH_DASHBOARD } from "routers/paths";
import { ROOT_PATH } from "types/Router";
import { TSelectOption } from "types/SelectOption";

export const DIRECTION_ROUTE_OPTIONS: TSelectOption[] = [
  {
    label: `${PAGE_TITLE.dashboard} - ${PATH_DASHBOARD.dashboard}`,
    value: PATH_DASHBOARD.dashboard,
  },
  {
    label: `${PAGE_TITLE.settings[ROOT_PATH]} - ${PATH_DASHBOARD.settings[ROOT_PATH]}`,
    value: PATH_DASHBOARD.settings[ROOT_PATH],
  },
  {
    label: `${PAGE_TITLE.orders[ROOT_PATH]} - ${PATH_DASHBOARD.orders[ROOT_PATH]}`,
    value: PATH_DASHBOARD.orders[ROOT_PATH],
  },
  {
    label: `${PAGE_TITLE.product[ROOT_PATH]} - ${PATH_DASHBOARD.product[ROOT_PATH]}`,
    value: PATH_DASHBOARD.product[ROOT_PATH],
  },
  {
    label: `${PAGE_TITLE.warehouse[ROOT_PATH]} - ${PATH_DASHBOARD.warehouse[ROOT_PATH]}`,
    value: PATH_DASHBOARD.warehouse[ROOT_PATH],
  },
  {
    label: `${PAGE_TITLE.customer[ROOT_PATH]} - ${PATH_DASHBOARD.customer[ROOT_PATH]}`,
    value: PATH_DASHBOARD.customer[ROOT_PATH],
  },
];
