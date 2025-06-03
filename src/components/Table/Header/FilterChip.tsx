import compact from "lodash/compact";
import flatMap from "lodash/flatMap";
import map from "lodash/map";
import { TAttribute } from "types/Attribute";
import { TChipFilter, TKeyFilter } from "types/Filter";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { DateChips } from "../Filter/DateChips";
import NumberChip from "../Filter/NumberChip";
import { SelectOptionChip } from "../Filter/SelectOptionChip";
import { WrapFilterChip, WrapFilterChipProps } from "../Filter/WrapFilterChip";
import { fNumber } from "utils/number";

export interface FilterChipType {
  type: "date" | "select" | "slider";
  options?: TSelectOption[];
  keysFilter?: TKeyFilter;
  mode?: "multiple" | "single";
  attributeOptions?: TAttribute[];
  dateFilterKeys?: TChipFilter[];
}

export interface FilterChipProps extends Omit<WrapFilterChipProps, "isActiveClearAllButton"> {
  params?: TParams;
  onDelete?: (type: string, value: string | number) => void;
  setFilterCount?: (value: number) => void;
  filterChipOptions?: FilterChipType[];
}

const FilterChips = ({
  params,
  onDelete,
  setFilterCount,
  filterChipOptions,
  ...props
}: Omit<FilterChipProps, "checkFilterCount" | "handleDelete">) => {
  let filterCount = 0;

  const handleDelete = (type: string, value: string | number) => {
    onDelete?.(type, value);
  };

  const checkFilterCount = (value: number) => {
    filterCount += value;
    setFilterCount?.(filterCount);
  };

  const flattenKeyFilters = filterChipOptions?.map((item) => {
    if (item.dateFilterKeys) {
      return item.dateFilterKeys.reduce((arrKey: TKeyFilter[], currKey) => {
        return [...arrKey, ...currKey.keyFilters];
      }, []);
    } else {
      return item.keysFilter;
    }
  });

  const handleCheckKeyParamsActive = ({
    keys,
    params,
  }: {
    keys: { disabled?: boolean; label: string; color?: string; title?: string }[];
    params: any;
  }) => {
    const keysFilter: string[] = [];

    map(keys, (item) => {
      if (params?.[item.label]) {
        // nếu filter là mãng rỗng thì không check;
        if (Array.isArray(params[item.label]) && params[item.label].length === 0) return;
        keysFilter.push(item.label);
      }
      return;
    });
    return { keysFilter };
  };

  const paramsActiveKeys = handleCheckKeyParamsActive({
    keys: compact(flatMap(flattenKeyFilters)),
    params,
  });

  return (
    <WrapFilterChip {...props} keysFilter={paramsActiveKeys.keysFilter}>
      <>
        {filterChipOptions?.map((item, idx) => {
          if (item) {
            if (item.type === "date") {
              return (
                <DateChips
                  key={idx}
                  handleDelete={handleDelete}
                  dateFilterKeys={item.dateFilterKeys || []}
                  params={params}
                  checkFilterCount={checkFilterCount}
                />
              );
            }
            // else if (item.type === "attribute") {
            //   return (
            //     <AttributeChips
            //       key={idx}
            //       handleDelete={handleDelete}
            //       attributeOptions={item.attributeOptions}
            //       keysFilter={item.keysFilter}
            //       params={params}
            //       checkFilterCount={checkFilterCount}
            //     />
            //   );
            // }
            else if (item.type === "select") {
              return (
                <SelectOptionChip
                  key={idx}
                  handleDelete={handleDelete}
                  options={item.options || []}
                  keysFilter={item.keysFilter}
                  params={params}
                  checkFilterCount={checkFilterCount}
                  mode={item.mode}
                />
              );
            } else if (item.type === "slider") {
              return (
                <NumberChip
                  key={idx}
                  params={params}
                  handleDelete={handleDelete}
                  keysFilter={item.keysFilter ? [item.keysFilter] : []}
                  setFilterCount={checkFilterCount}
                  formatValue={fNumber}
                />
              );
            } else {
              return null;
            }
          } else {
            return null;
          }
        })}
      </>
    </WrapFilterChip>
  );
};

export default FilterChips;
