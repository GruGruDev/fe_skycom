import { useEffect } from "react";
import reduce from "lodash/reduce";
import { NULL_OPTION } from "constants/index";
import { TKeyFilter } from "types/Filter";
import { TSelectOption } from "types/SelectOption";
import { TParams } from "types/Param";
import { FilterChipItem } from "./FilterChipItem";

export interface SelectOptionChipProps {
  handleDelete?: (type: string, value: any) => void;
  keysFilter?: TKeyFilter;
  options: TSelectOption[];
  params?: TParams;
  checkFilterCount?: (value: number) => void;
  selecOptionKey?: keyof TSelectOption;
  mode?: "multiple" | "single";
}

export const SelectOptionChip = ({
  handleDelete,
  options,
  keysFilter,
  params,
  mode = "multiple",
  checkFilterCount,
  selecOptionKey = "value",
}: SelectOptionChipProps) => {
  let filterCount = 0;

  const cloneParams = params as { [key: string]: object | null };

  useEffect(() => {
    checkFilterCount?.(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  const allOptions: TSelectOption[] = [...options, NULL_OPTION];

  const value =
    keysFilter && cloneParams?.[keysFilter.label]
      ? reduce(
          mode === "single" ? [cloneParams?.[keysFilter.label]] : cloneParams?.[keysFilter.label],
          (prev: any, current: any) => {
            const matchOption = allOptions?.find(
              (item) => `${item[selecOptionKey]}` === `${current}`,
            );

            if (matchOption) {
              filterCount += 1;
              const matchOptionFormat = {
                label: matchOption?.label,
                onRemove: keysFilter.disabled
                  ? undefined
                  : () => handleDelete?.(keysFilter.label, matchOption[selecOptionKey]),
              };
              return [...prev, matchOptionFormat];
            }

            return prev;
          },
          [],
        )
      : [];

  return <>{value.length > 0 && <FilterChipItem title={keysFilter?.title} value={value} />}</>;
};
