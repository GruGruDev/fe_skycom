import reduce from "lodash/reduce";
import { TColumn } from "types/DGrid";
import { TSelectOption } from "types/SelectOption";
import { toSimplest } from "utils/strings";
import { sumAndAvgMetric } from "./sumAndAvgMetric";

/**
 * tính tổng các fields trong columns với data
 * @param columns danh sách cột để tính tổng
 * @param endDemensionColumn là cột được show đầu tiên trong bảng, cũng là dimension được show cuối cùng trong group
 * @param detailRowName tên cột với value là number để biết cột thứ bao nhiêu đang mở detail
 * @param coefficient trọng số để chia trung bình cell value @default 1
 * @param data dữ liệu bảng @default []
 * @param groupValue giá trị của cột được gom nhóm
 * @param groupKey tên cột được gom nhóm
 * @param filterColumnExtensions danh sách cột được gom nhóm và tìm groupValue trong groupOptions => show ra cột endDemensionColumn.name
 * @returns
 */
export const sumDataByColumn = ({
  columns,
  endDemensionColumn,
  detailRowName,
  coefficient = 1,
  data = [],
  groupValue,
  groupKey,
  filterColumnExtensions,
}: {
  endDemensionColumn: TColumn;
  coefficient?: number;
  data: any;
  groupValue: string;
  groupKey: string;
  columns?: TColumn[];
  detailRowName?: string;
  filterColumnExtensions?: { columnName: string; options: TSelectOption[] }[];
}) => {
  return reduce(
    columns,
    (prev: { [key: string]: any }, cur) => {
      const columnOptionValue = filterColumnExtensions?.find(
        (item) => item.columnName === groupKey,
      );

      const endDemensionColumnValue = columnOptionValue?.options.find(
        (item) => item.value == groupValue,
      )?.label;

      return {
        ...prev,
        //
        [cur.name]: sumAndAvgMetric({
          coefficient,
          columnName: cur.name,
          data: data[groupValue],
          iteratee: cur.name,
        }),
        [endDemensionColumn.name]: columnOptionValue
          ? endDemensionColumnValue
          : groupKey
            ? data[groupValue][0][groupKey]
            : groupValue,
        //
        compare: {
          ...prev.compare,
          [cur.name]: sumAndAvgMetric({
            coefficient,
            columnName: cur.name,
            data: data[groupValue],
            iteratee: `compare.${cur.name}`,
          }),
          [endDemensionColumn.name]: columnOptionValue
            ? endDemensionColumnValue
            : groupKey
              ? data[groupValue][0]?.compare?.[groupKey]
              : groupValue,
        },
      };
    },
    {
      ...data[groupValue],
      [endDemensionColumn.name]: groupValue,
      detailRowName: detailRowName ? toSimplest(`${detailRowName}${groupValue}`) : groupValue,
      data: data[groupValue],
    },
  );
};
