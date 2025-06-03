import { FilterChipType } from "components/Table/Header/FilterChip";
import { PRODUCT_STATUS_OPTIONS } from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import map from "lodash/map";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";
import { formatOptionSelect } from "utils/option";

export const filterChips = ({
  category,
  supplier,
  users,
}: {
  category: TSelectOption[];
  supplier: TSelectOption[];
  users?: TUser[];
}): FilterChipType[] => [
  {
    type: "select",
    options: category,
    keysFilter: { title: PRODUCT_LABEL.category, label: "category" },
  },
  {
    type: "select",
    options: supplier,
    keysFilter: { title: PRODUCT_LABEL.supplier, label: "supplier" },
  },
  {
    type: "select",
    options: PRODUCT_STATUS_OPTIONS,
    keysFilter: { title: PRODUCT_LABEL.is_active, label: "is_active" },
  },
  {
    type: "select",
    options: map(users, formatOptionSelect),
    keysFilter: { title: PRODUCT_LABEL.created_by, label: "created_by" },
  },
  {
    type: "slider",
    keysFilter: { label: "total_inventory_min", title: PRODUCT_LABEL.total_inventory_from },
  },
  {
    type: "slider",
    keysFilter: { label: "total_inventory_max", title: PRODUCT_LABEL.total_inventory_to },
  },
];
