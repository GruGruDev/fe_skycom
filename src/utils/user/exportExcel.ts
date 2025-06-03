import { USER_LABEL } from "constants/user/label";
import find from "lodash/find";
import omit from "lodash/omit";
import { TAttribute } from "types/Attribute";
import { TRole } from "types/Permission";
import { TUser } from "types/User";

export const exportExcel = (option: {
  item: { [key: string]: any };
  listRoles: TRole[];
  users: TUser[];
}): { [key: string]: unknown } => {
  const itemClone = omit(option.item, ["id", "password", "images"]);

  const newItem: { [key: string]: string | null | undefined } = {};

  for (const keyOj in itemClone) {
    switch (keyOj) {
      case "modified_by":
      case "created_by":
        if (itemClone[keyOj]) {
          newItem[USER_LABEL[keyOj]] = (
            find(option.users, (user) => user.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      case "is_superuser":
      case "is_online":
      case "is_active":
      case "is_CRM":
      case "is_hotdata":
        newItem[USER_LABEL[keyOj]] = itemClone[keyOj] ? USER_LABEL.is_hotdata : "";
        break;
      case "role":
        if (itemClone[keyOj]) {
          newItem[USER_LABEL[keyOj]] = (
            find(option.listRoles, (role) => role.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      default:
        const userKey = keyOj as keyof typeof USER_LABEL;
        if (USER_LABEL[userKey]) {
          newItem[USER_LABEL[userKey]] = itemClone[keyOj as keyof typeof itemClone]?.toString();
        } else {
          newItem[keyOj] = itemClone[keyOj as keyof typeof itemClone]?.toString();
        }
        break;
    }
  }

  return newItem;
};
