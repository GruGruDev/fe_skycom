import { GENDER_LABEL, TGender } from "types/Customer";
import { TSelectOption } from "types/SelectOption";
import { CUSTOMER_LABEL } from "./label";
import { TColumn } from "types/DGrid";

export const GENDER_OPTIONS: { label: string; value: TGender }[] = [
  { label: CUSTOMER_LABEL[GENDER_LABEL.male], value: "male" },
  { label: CUSTOMER_LABEL[GENDER_LABEL.female], value: "female" },
];

export const CUSTOMER_ORDERING_OPTIONS: TSelectOption[] = [
  { value: "name", label: CUSTOMER_LABEL.name },
  { value: "birthday", label: CUSTOMER_LABEL.birthday },
  { value: "rank", label: CUSTOMER_LABEL.rank },
  { value: "created", label: CUSTOMER_LABEL.created },
  { value: "total_order", label: CUSTOMER_LABEL.total_order },
];

export const CUSTOMER_SORT_EXTENSIONS: TColumn[] = [
  { name: "birthday_day", title: CUSTOMER_LABEL.birthday_day },
  { name: "birthday_month", title: CUSTOMER_LABEL.birthday_month },
];
