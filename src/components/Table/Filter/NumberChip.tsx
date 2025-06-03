import map from "lodash/map";
import { useEffect } from "react";
import { TKeyFilter } from "types/Filter";
import { FilterChipItem } from "./FilterChipItem";

const NumberChip = ({
  handleDelete,
  keysFilter,
  params,
  formatValue,
  setFilterCount,
}: {
  handleDelete: (type: string, value?: any) => void;
  keysFilter: TKeyFilter[];
  params?: any;
  setFilterCount?: (value: number) => void;
  formatValue?: (value: string | number) => string;
}) => {
  let filterCount = 0;

  useEffect(() => {
    setFilterCount?.(filterCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, filterCount]);

  return (
    <>
      {map(keysFilter, (item, idx) => {
        if (params[item.label]) {
          filterCount += 1;
        }
        if (params?.[item.label] || params?.[item.label] === 0) {
          const label = formatValue
            ? formatValue(params?.[item.label]).toString()
            : params?.[item.label].toString();
          const dataRender = {
            title: item.title,
            value: {
              label: label,
              onRemove: item.disabled ? undefined : () => handleDelete(item.label, label),
            },
          };
          return <FilterChipItem {...dataRender} key={idx} />;
        }
        return null;
      })}
    </>
  );
};

export default NumberChip;
