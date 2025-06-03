import { ORDER_STATUS } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import find from "lodash/find";
import { THistoryChangeReasonRes } from "types/History";
import { addressToString } from "utils/customer/addressToString";
import { fDateTime } from "utils/date";
import { fNumber } from "utils/number";

export const onChangeHistoryFields = ({
  fieldChanges,
  old,
  cur,
}: {
  fieldChanges: string[];
  old: any;
  cur: any;
}) => {
  let result: THistoryChangeReasonRes[] = [];

  const addField = (newItem: { field: string; old?: string; cur?: string }) => {
    const { old = "---", cur = "---", field } = newItem;
    result.push({ old, cur, field });
  };

  const orderStatusLabel = (value: string) =>
    find(ORDER_STATUS, (item) => item.value === value)?.label;

  fieldChanges.map((field: string) => {
    switch (field) {
      case "status":
        addField({
          old: orderStatusLabel(old?.[field]),
          cur: orderStatusLabel(cur?.[field]),
          field: ORDER_LABEL[field],
        });
        break;
      case "name_shipping":
      case "phone_shipping":
      case "sale_note":
      case "tracking_number":
      case "delivery_note":
        addField({ old: old?.[field], cur: cur?.[field], field: ORDER_LABEL[field] });
        break;
      case "source":
        addField({ old: old?.[field]?.name, cur: cur?.[field]?.name, field: ORDER_LABEL[field] });
        break;
      case "address_shipping":
        addField({
          old: addressToString(old?.[field]),
          cur: addressToString(cur?.[field]),
          field: ORDER_LABEL.address_shipping,
        });
        break;
      case "cancel_reason":
        addField({
          old: old?.[field]?.name,
          cur: cur?.[field]?.name,
          field: ORDER_LABEL[field],
        });
        break;
      case "appointment_date":
      case "complete_time":
        addField({
          old: fDateTime(old?.[field])?.toString(),
          cur: fDateTime(cur?.[field])?.toString(),
          field: ORDER_LABEL[field],
        });
        break;
      case "value_cross_sale":
      case "printed_at":
        addField({
          old: fNumber(old?.[field]),
          cur: fNumber(cur?.[field]),
          field: ORDER_LABEL[field],
        });
        break;
      case "is_print":
        addField({
          old: old?.[field] ? ORDER_LABEL.printed : ORDER_LABEL.not_printed,
          cur: cur?.[field] ? ORDER_LABEL.printed : ORDER_LABEL.not_printed,
          field: ORDER_LABEL.print,
        });
        break;
      case "printed_by":
        addField({
          old: old?.[field]?.name,
          cur: cur?.[field]?.name,
          field: ORDER_LABEL[field],
        });
        break;
      default:
        return result;
    }
  });

  return result;
};
