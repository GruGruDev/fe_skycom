import sumBy from "lodash/sumBy";

/**
 * tính tổng hoặc giá trị trung bình của mỗi cell
 * @param columnName
 * @param  iteratee chuỗi mẫu để tính sum, có thể nested object bằng cách thêm dấu . giữa các key
 * @example status.source.shipping_date
 * @param coefficient mẫu số tính giá trị trung bình
 * @returns number
 */
export const sumAndAvgMetric = ({
  columnName,
  data,
  coefficient,
  iteratee,
}: {
  columnName: string;
  iteratee: string;
  data: any[];
  coefficient: number;
}) => {
  return columnName.includes("avg")
    ? Math.round(sumBy(data, iteratee) / coefficient)
    : sumBy(data, iteratee);
};
