import { SHEET_TYPE_VALUE } from "constants/warehouse";
import { SHEET_LABEL } from "constants/warehouse/label";
import find from "lodash/find";
import omit from "lodash/omit";
import { TAddress } from "types/Address";
import { TAttribute } from "types/Attribute";
import { TSheetType } from "types/Sheet";
import { TUser } from "types/User";
import { TWarehouse } from "types/Warehouse";
import { addressToString } from "utils/customer/addressToString";
import { fDate, fDateTime } from "utils/date";

export const exportExcel = ({
  item,
  label,
  users,
  inventoryReasons,
  warehouses,
}: {
  item: {
    [key: string]: any;
  };
  label: any;
  users: TUser[];
  warehouses?: Partial<TWarehouse>[];
  inventoryReasons?: Partial<TAttribute>[];
}): { [key: string]: unknown } => {
  const itemClone = omit(item, ["id", "is_sales", "order"]);

  const newItem: { [key: string]: string | null | undefined } = {};

  for (const keyOj in itemClone) {
    switch (keyOj) {
      case "created":
      case "confirm_date":
      case "modified":
      case "scan_at":
        newItem[label[keyOj]] = itemClone[keyOj] ? fDate(itemClone[keyOj]) : null;
        break;
      case "created_by":
      case "modified_by":
      case "confirm_by":
        if (itemClone[keyOj]) {
          newItem[label[keyOj]] = (
            find(users, (user) => user.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      case "scan_by":
        if (itemClone[keyOj]) {
          const userScan = find(users, (user) => user.id === itemClone[keyOj]?.id)?.name;
          newItem[label[keyOj]] = userScan ? userScan : "admin";
        }
        break;
      case "warehouse":
      case "warehouse_to":
      case "warehouse_from":
        if (itemClone[keyOj]) {
          newItem[label[keyOj]] = (
            find(warehouses, (warehouse) => warehouse.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      case "change_reason":
        if (itemClone[keyOj]) {
          newItem[label[keyOj]] = (
            find(inventoryReasons, (reason) => reason.id === itemClone[keyOj]) as TAttribute
          )?.name;
        }
        break;
      case "is_confirm":
        newItem[label[keyOj]] = itemClone[keyOj] ? SHEET_LABEL.confirm : SHEET_LABEL.not_confirm;
        break;
      case "is_delete":
        newItem[label[keyOj]] = itemClone[keyOj] ? SHEET_LABEL.cancelled : SHEET_LABEL.not_cancel;
        break;
      case "type":
        const typeKey = itemClone[keyOj] as TSheetType;
        newItem[label[keyOj]] = itemClone[keyOj] ? SHEET_TYPE_VALUE[typeKey] : "";
        break;
      case "addresses":
        let addresses = "";
        if (itemClone[keyOj])
          (itemClone[keyOj] as TAddress[]).map((address) => {
            addresses += `${addressToString(address)}, `;
          });
        newItem[label[keyOj]] = addresses;
        break;
      case "product_variant_batch":
        newItem[label[keyOj]] = itemClone[keyOj]?.name;
        break;
      case "product_variant":
        newItem[label[keyOj]] = itemClone[keyOj]?.name;
        newItem[label["SKU"]] = itemClone[keyOj]?.SKU_code;
        break;
      case "sheet":
        newItem[label["sheet_status"]] = itemClone?.sheet?.is_confirm
          ? label["confirmed"]
          : label["not_confirm"];
        newItem[label["confirm_date"]] = fDateTime(itemClone?.sheet?.confirm_date);
        newItem[label["confirm_by"]] = (
          find(users, (user) => user.id === itemClone?.sheet?.confirm_by?.name) as TAttribute
        )?.name;
        newItem[label["sheet_note"]] = itemClone?.sheet?.note;
        break;
      default:
        const warehouseKey = keyOj as keyof typeof label;
        if (label[warehouseKey]) {
          newItem[label[warehouseKey]] = itemClone[keyOj as keyof typeof itemClone]?.toString();
        } else {
          newItem[keyOj] = itemClone[keyOj as keyof typeof itemClone]?.toString();
        }
        break;
    }
  }
  return newItem;
};
