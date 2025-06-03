import { PRODUCT_LABEL } from "constants/product/label";
import find from "lodash/find";
import omit from "lodash/omit";
import { STATUS_PRODUCT_LABEL } from "types/Product";
import { TUser } from "types/User";
import { fDate } from "utils/date";

export const exportExcelMaterial = (
  item: {
    [key: string]: any;
  },
  users?: TUser[],
): { [key: string]: unknown } => {
  const itemClone = omit(item, [
    "id",
    "tags",
    "images",
    "type",
    "length",
    "variants",
    "combo_variants",
  ]);

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
