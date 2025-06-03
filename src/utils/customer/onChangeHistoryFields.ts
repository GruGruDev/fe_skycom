import { CUSTOMER_LABEL } from "constants/customer/label";
import find from "lodash/find";
import { THistoryChangeReasonRes } from "types/History";
import { TUser } from "types/User";
import { fDate } from "utils/date";
import { fNumber } from "utils/number";

export const onChangeHistoryFields = ({
  fieldChanges,
  old,
  cur,
  users,
}: {
  fieldChanges: string[];
  old: any;
  cur: any;
  users?: TUser[];
}) => {
  let result: THistoryChangeReasonRes[] = [];

  const addField = (newItem: { field: string; old?: string; cur?: string }) => {
    const { old = "---", cur = "---", field } = newItem;
    result.push({ old, cur, field });
  };

  const user = (userId: string) => find(users, (item) => item.id === userId);

  fieldChanges.map((field: string) => {
    switch (field) {
      case "name":
      case "gender":
      case "source":
      case "customer_note":
        addField({ old: old?.[field], cur: cur?.[field], field: CUSTOMER_LABEL[field] });
        break;
      case "total_order":
      case "total_spent":
      case "shipping_return_order":
      case "shipping_return_spent":
      case "shipping_cancel_order":
      case "shipping_cancel_spent":
        addField({
          old: fNumber(old?.[field]),
          cur: fNumber(cur?.[field]),
          field: CUSTOMER_LABEL[field],
        });
        break;
      case "birthday":
      case "latest_up_rank_date":
        addField({
          old: fDate(old?.[field])?.toString(),
          cur: fDate(cur?.[field])?.toString(),
          field: CUSTOMER_LABEL[field],
        });
        break;
      case "customer_care_staff":
        addField({
          old: user(old?.[field])?.name,
          cur: user(cur?.[field])?.name,
          field: CUSTOMER_LABEL[field],
        });
        break;
      default:
        return result;
    }
  });

  return result;
};
