import { ROLE_TAB } from "constants/role";

export const redirectVariantUrl = (id?: string) => {
  return `/${ROLE_TAB.PRODUCT}/variant/${id}`;
};

export const redirectMaterialUrl = (id?: string) => {
  return `/${ROLE_TAB.PRODUCT}/material/${id}`;
};
