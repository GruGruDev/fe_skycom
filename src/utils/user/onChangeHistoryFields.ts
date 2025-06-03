import { USER_LABEL } from "constants/user/label";
import find from "lodash/find";
import { THistoryChangeReasonRes } from "types/History";
import { TRole } from "types/Permission";
import { USER_ACTIVE_LABEL } from "types/User";

export const onChangeHistoryFields = ({
  fieldChanges,
  old,
  cur,
  roles,
}: {
  fieldChanges: string[];
  old: any;
  cur: any;
  roles?: TRole[];
}) => {
  let result: THistoryChangeReasonRes[] = [];

  const addField = (newItem: { field: string; old?: string; cur?: string }) => {
    const { old = "---", cur = "---", field } = newItem;
    result.push({ old, cur, field });
  };

  const role = (roleId: string) => find(roles, (item) => item.id === roleId);
  const isActive = (value: boolean) =>
    value ? USER_LABEL[USER_ACTIVE_LABEL.active] : USER_LABEL[USER_ACTIVE_LABEL.inactive];

  fieldChanges.map((field: string) => {
    switch (field) {
      case "name":
      case "phone":
      case "email":
        addField({ old: old?.[field], cur: cur?.[field], field: USER_LABEL[field] });
        break;
      case "is_active":
        addField({
          old: isActive(old?.[field]),
          cur: isActive(cur?.[field]),
          field: USER_LABEL.status,
        });
        break;
      case "role":
        addField({
          old: role(old?.[field])?.name,
          cur: role(cur?.[field])?.name,
          field: USER_LABEL.role,
        });
        break;
      default:
        return result;
    }
  });

  return result;
};
