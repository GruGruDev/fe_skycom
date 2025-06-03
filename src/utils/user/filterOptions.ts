import { ALL_OPTION } from "constants/index";
import { STATUS_OPTIONS } from "constants/user";
import { USER_LABEL } from "constants/user/label";
import { TFilterProps } from "types/DGrid";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";
import { revertFromQueryForSelector } from "utils/param";
const selectorStyle = { width: 180, marginTop: 4 };

export const filterOptions = ({
  onSetParams,
  roles,
  departments,
  params,
}: {
  departments: TSelectOption[];
  roles: TSelectOption[];
  params?: TParams;
  onSetParams: (
    name: keyof TUser,
    value: string | number | "all" | "none" | (string | number)[],
  ) => void;
}): TFilterProps[] => {
  return [
    {
      key: "role",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("role", value),
        options: [ALL_OPTION, ...roles],
        title: USER_LABEL.role,
        value: revertFromQueryForSelector(params?.role),
        style: selectorStyle,
        selectorId: "role",
      },
    },
    {
      key: "department",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("department", value),
        options: [ALL_OPTION, ...departments],
        title: USER_LABEL.department,
        value: revertFromQueryForSelector(params?.department),
        style: selectorStyle,
        selectorId: "department",
      },
    },
    {
      key: "is_active",
      type: "select",
      multiSelectProps: {
        onChange: (value) => onSetParams("is_active", value),
        options: STATUS_OPTIONS,
        title: USER_LABEL.is_active,
        value: revertFromQueryForSelector(params?.is_active),
        style: selectorStyle,
        selectorId: "is_active",
      },
    },
  ];
};
