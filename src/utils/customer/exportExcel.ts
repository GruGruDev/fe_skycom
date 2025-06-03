import { CUSTOMER_LABEL } from "constants/customer/label";
import find from "lodash/find";
import omit from "lodash/omit";
import { TAddress } from "types/Address";
import { TAttribute } from "types/Attribute";
import { TPhone } from "types/Customer";
import { TUser } from "types/User";
import { fDate } from "utils/date";

export const exportExcel = (
  item: {
    [key: string]: any;
  },
  users: TUser[],
): { [key: string]: unknown } => {
  const itemClone = omit(item, ["id"]);

  const newItem: { [key: string]: string | null | undefined } = {};

  for (const keyOj in itemClone) {
    switch (keyOj) {
      case "created_by":
      case "modified_by":
        newItem[CUSTOMER_LABEL[keyOj]] = itemClone[keyOj]
          ? (itemClone[keyOj] as TAttribute).name
          : null;
        break;
      case "groups":
      case "tags":
        let itemValue = "";
        if (itemClone[keyOj]) {
          (itemClone[keyOj] as TAttribute[]).map((att) => {
            itemValue = itemValue + `${att.name}, `;
          });
        }
        newItem[CUSTOMER_LABEL[keyOj]] = itemValue;
        break;
      case "gender":
        newItem[CUSTOMER_LABEL[keyOj]] = itemClone[keyOj] === "male" ? CUSTOMER_LABEL.male : null;
        newItem[CUSTOMER_LABEL[keyOj]] =
          itemClone[keyOj] === "female" ? CUSTOMER_LABEL.female : null;
        break;
      case "created":
      case "modified":
        newItem[CUSTOMER_LABEL[keyOj]] = itemClone[keyOj] ? fDate(itemClone[keyOj]) : null;
        break;
      case "addresses":
        let address = "";
        if (itemClone[keyOj]) {
          (itemClone[keyOj] as TAddress[]).map((addr) => {
            address =
              address +
              `${addr.address}, ${addr.ward?.ward}, ${addr.ward?.district}, ${addr.ward?.province}, `;
          });
        }
        newItem[CUSTOMER_LABEL[keyOj]] = address;
        break;
      case "phones":
        let phones = "";
        if (itemClone[keyOj]) {
          (itemClone[keyOj] as Partial<TPhone>[]).map((phone) => {
            phones = phones + `${phone.phone}, `;
          });
        }
        newItem[CUSTOMER_LABEL[keyOj]] = phones;
        break;
      case "modified_care_staff_by":
      case "customer_care_staff":
        if (itemClone[keyOj]) {
          newItem[CUSTOMER_LABEL[keyOj]] = (
            find(users, (user) => user.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      default:
        const customerKey = keyOj as keyof typeof CUSTOMER_LABEL;
        if (CUSTOMER_LABEL[customerKey]) {
          newItem[CUSTOMER_LABEL[customerKey]] =
            itemClone[keyOj as keyof typeof itemClone]?.toString();
        } else {
          newItem[keyOj] = itemClone[keyOj as keyof typeof itemClone]?.toString();
        }
        break;
    }
  }
  return newItem;
};
