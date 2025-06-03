import { Filter } from "@devexpress/dx-react-grid";
import { OPERATORS } from "constants/index";
import { TColumnType } from "types/DGrid";
import { TSelectOption } from "types/SelectOption";
import { searchAlgorithm } from "utils/strings";

export const filterColumn = (
  value: string,
  filter: Filter,
  filterColumnExtensions?: {
    columnName: string;
    options: TSelectOption[];
  }[],
  onFilterColumnExtensions?: (filter: {
    rowValue: string;
    columnName: string;
    filterValue: string;
  }) => boolean,
) => {
  let result = true;
  const itemFilter: {
    operators?:
      | {
          larger?: OPERATORS | undefined;
          smaller?: OPERATORS | undefined;
        }
      | undefined;
    value: string;
    columnName: string;
    type: TColumnType;
  } = filter.value;

  if (itemFilter.value) {
    if (itemFilter.type === "number") {
      if (!itemFilter.operators?.larger && !itemFilter.operators?.smaller) {
        const compare = parseInt(value) === parseInt(itemFilter.value);
        if (!compare) result = false;

        // nhỏ hơn
      } else if (itemFilter.operators?.smaller && !itemFilter.operators?.larger) {
        if (itemFilter.operators?.smaller === OPERATORS.smaller) {
          const isSmaller = parseInt(value) < parseInt(itemFilter.value);
          if (!isSmaller) result = false;
        }
        if (itemFilter.operators?.smaller === OPERATORS.smallerOrEqual) {
          const isSmallerAndEqual = parseInt(value) <= parseInt(itemFilter.value);
          if (!isSmallerAndEqual) result = false;
        }
        // lớn hơn
      } else if (itemFilter.operators?.larger && !itemFilter.operators?.smaller) {
        if (itemFilter.operators?.larger === OPERATORS.larger) {
          const isLarger = parseInt(value) > parseInt(itemFilter.value);
          if (!isLarger) result = false;
        }
        if (itemFilter.operators?.larger === OPERATORS.largerOrEqual) {
          const isLargerAndEqual = parseInt(value) >= parseInt(itemFilter.value);
          if (!isLargerAndEqual) result = false;
        }
      }
    } else {
      const isFilterExtension = filterColumnExtensions?.find(
        (item) => item.columnName === itemFilter.columnName,
      );

      if (onFilterColumnExtensions && !!isFilterExtension) {
        result = onFilterColumnExtensions({
          rowValue: value,
          filterValue: itemFilter.value,
          columnName: itemFilter.columnName,
        });
      } else {
        const isMatch = searchAlgorithm(value, itemFilter.value);
        if (!isMatch) result = false;
      }
    }
  }

  return result;
};
