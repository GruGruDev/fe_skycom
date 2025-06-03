import { PRODUCT_LABEL } from "constants/product/label";
import find from "lodash/find";
import omit from "lodash/omit";
import { TAttribute } from "types/Attribute";
import { STATUS_PRODUCT_LABEL, TComboVariant, TVariant } from "types/Product";
import { TUser } from "types/User";
import { fDate } from "utils/date";

export const exportExcel = (
  item: {
    [key: string]: any;
  },
  category?: TAttribute[],
  supplier?: TAttribute[],
  users?: TUser[],
): { [key: string]: unknown } => {
  const itemClone = omit(item, ["id", "tags", "images", "type"]);

  const newItem: { [key: string]: string | null | undefined } = {};

  for (const keyOj in itemClone) {
    switch (keyOj) {
      // case "product": hiện đang show ID
      case "modified_by":
      case "created_by":
        newItem[PRODUCT_LABEL[keyOj]] = find(users, (user) => user.id === itemClone[keyOj])?.name;
        break;
      case "is_active":
        newItem[PRODUCT_LABEL[keyOj]] = itemClone[keyOj]
          ? PRODUCT_LABEL[STATUS_PRODUCT_LABEL.active]
          : PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive];
        break;
      case "variants":
        let variants = "";
        if (itemClone[keyOj])
          (itemClone[keyOj] as TVariant[]).map((variant) => {
            variants = variants + `${variant.name}, `;
          });
        newItem[PRODUCT_LABEL[keyOj]] = variants;
        break;
      case "combo_variants":
        let comboVariants = "";
        if (itemClone[keyOj])
          (itemClone[keyOj] as TComboVariant[]).map((variant) => {
            comboVariants = comboVariants + `${variant.detail_variant?.name}, `;
          });
        newItem[PRODUCT_LABEL[keyOj]] = comboVariants;
        break;
      case "category":
        if (itemClone[keyOj]) {
          newItem[PRODUCT_LABEL[keyOj]] = (
            find(category, (item) => item.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      case "supplier":
        if (itemClone[keyOj]) {
          newItem[PRODUCT_LABEL[keyOj]] = (
            find(supplier, (item) => item.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      case "created":
      case "modified":
        newItem[PRODUCT_LABEL[keyOj]] = itemClone[keyOj] ? fDate(itemClone[keyOj]) : null;
        break;
      default:
        const productLabelKey = keyOj as keyof typeof PRODUCT_LABEL;
        if (PRODUCT_LABEL[productLabelKey]) {
          newItem[PRODUCT_LABEL[productLabelKey]] =
            itemClone[keyOj as keyof typeof itemClone]?.toString();
        } else {
          newItem[keyOj] = itemClone[keyOj as keyof typeof itemClone]?.toString();
        }
        break;
    }
  }
  return newItem;
};
