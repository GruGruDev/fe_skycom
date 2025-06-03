import { FilterChipType } from "components/Table/Header/FilterChip";
import { ALL_OPTION } from "constants/index";
import { IS_ACTIVE_OPTIONS } from "constants/user";
import { USER_LABEL } from "constants/user/label";
import { TSelectOption } from "types/SelectOption";

export const filterChips = ({
  roles,
  departments,
}: {
  roles: TSelectOption[];
  departments: TSelectOption[];
}): FilterChipType[] => [
  {
    type: "select",
    options: [ALL_OPTION, ...roles],
    keysFilter: { label: "role", title: USER_LABEL.role },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...departments],
    keysFilter: { label: "department", title: USER_LABEL.department },
  },
  {
    type: "select",
    options: [ALL_OPTION, ...IS_ACTIVE_OPTIONS],
    keysFilter: { label: "is_active", title: USER_LABEL.active },
  },
];
