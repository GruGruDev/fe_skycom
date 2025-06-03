import compact from "lodash/compact";
import { useEffect } from "react";
import { FilterChipItem } from "./FilterChipItem";
import { TAttribute } from "types/Attribute";
import { TParams } from "types/Param";
import { TKeyFilter } from "types/Filter";
import { NONE } from "constants/index";

const NONE_OPTIONS = [
  { id: "none", name: NONE },
  { id: "null", name: NONE },
];

export interface AttributeChipProps {
  handleDelete?: (type: string, value: any) => void;
  attributeOptions?: TAttribute[];
  params?: TParams;
  checkFilterCount?: (value: number) => void;
  keysFilter?: TKeyFilter;
  keyLabel?: keyof Pick<TAttribute, "name">;
  attributeKey?: keyof Pick<TAttribute, "name" | "id">;
}
export const AttributeChips = ({
  handleDelete,
  attributeOptions = [],
  params,
  checkFilterCount,
  keysFilter,
  keyLabel = "name",
  attributeKey = "id",
}: AttributeChipProps) => {
  let filterCount = 0;

  const cloneParams = params as { [key: string]: Array<unknown> | null };

  useEffect(() => {
    checkFilterCount && checkFilterCount(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  const allOptions = [...attributeOptions, ...NONE_OPTIONS];

  const value: any =
    keysFilter && compact(cloneParams?.[keysFilter.label])
      ? compact(cloneParams?.[keysFilter.label])?.reduce((prev: any, current: any) => {
          const matchOption = allOptions?.find((item: TAttribute) => {
            return `${item[attributeKey]}` === `${current}`;
          });
          if (matchOption) {
            filterCount += 1;
            const matchOptionFormat = {
              label: matchOption[keyLabel],
              onRemove: () => handleDelete?.(keysFilter.label, matchOption[attributeKey]),
            };
            return [...prev, matchOptionFormat];
          }
          return prev;
        }, [])
      : [];

  return <>{value.length > 0 && <FilterChipItem title={keysFilter?.title} value={value} />}</>;
};
