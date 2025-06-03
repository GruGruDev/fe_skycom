import map from "lodash/map";
import { fDate } from "utils/date";
import { useEffect } from "react";
import { FilterChipItem, DataRenderType } from "./FilterChipItem";
import { TChipFilter } from "types/Filter";
import { TParams } from "types/Param";

export interface DateChipProps {
  handleDelete?: (type: string, value: any) => void;
  dateFilterKeys: TChipFilter[];
  params?: TParams;
  checkFilterCount?: (value: number) => void;
}

export const DateChips = ({
  handleDelete,
  dateFilterKeys,
  params,
  checkFilterCount,
}: DateChipProps) => {
  let filterCount = 0;

  useEffect(() => {
    checkFilterCount && checkFilterCount(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  return (
    <>
      {map(dateFilterKeys, (item, idx) => {
        const cloneParams = params as { [key: string]: Date };
        if (
          cloneParams?.[item?.keyFilters[0]?.label] ||
          cloneParams?.[item?.keyFilters[1]?.label]
        ) {
          filterCount += 1;
          const dataRender: DataRenderType = {
            title: item.title,
            value: [
              {
                label: `${fDate(cloneParams?.[item?.keyFilters[0]?.label])}`,
                onRemove: () =>
                  handleDelete?.(
                    item?.keyFilters[0]?.label,
                    cloneParams?.[item?.keyFilters[0]?.label],
                  ),
              },
              {
                label: `${fDate(cloneParams?.[item?.keyFilters[1]?.label])}`,
                onRemove: () =>
                  handleDelete?.(
                    item?.keyFilters[1]?.label,
                    cloneParams?.[item?.keyFilters[1]?.label],
                  ),
              },
            ],
          };
          return <FilterChipItem {...dataRender} key={idx} />;
        }
        return null;
      })}
    </>
  );
};
