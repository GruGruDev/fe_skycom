import isEqual from "lodash/isEqual";
import map from "lodash/map";
import reduce from "lodash/reduce";
import uniq from "lodash/uniq";
import { isArraySubset } from "utils/number";
import { getFilter } from "./filterSettings";
import { TColumn } from "types/DGrid";
import FilterSet from "../Filter/FilterSet";
import { TPivotDateFilter } from "types/Pivot";

export const checkCacheParamsToGetReport = ({
  dimensionsSelected,
  metricsSelected,
  cacheFilter,
  dimensionFilter,
  metricFilter,
  cacheDimensions,
  cacheMetrics,
  setCache,
}: {
  dimensionsSelected: TColumn[];
  metricsSelected: TColumn[];
  dimensionFilter?: FilterSet;
  metricFilter?: FilterSet;
  cacheFilter?: {
    b_expr_dims: string;
    b_expr_metrics: string;
    filters: string;
  };
  cacheDimensions: string[];
  cacheMetrics: string[];
  setCache: (
    value: React.SetStateAction<{
      dimensions: string[];
      metrics: string[];
      date: TPivotDateFilter;
      dateCompare?: TPivotDateFilter | undefined;
      filter?:
        | {
            b_expr_dims: string;
            b_expr_metrics: string;
            filters: string;
          }
        | undefined;
    }>,
  ) => void;
}) => {
  // format lại params
  const dimensionsParams = reduce(
    dimensionsSelected,
    (prev: string[], cur) => {
      // vì trong group những dimension có cả _id và _name thì options của dimensions cần để là _id để khi group thì value của group là duy nhất (vì nó là _id)
      // ví dụ: source, source_id, source_name => option nằm trong dimesions phải là source_id(để uniq) để group
      // nhận dimension có chứa _id => remove _id để chỉ gởi lên dimension để get report
      // ví dụ source_id => source
      const item = cur.name.includes("_id") ? cur.name.slice(0, -2) : cur.name;
      return [...prev, item];
    },
    ["created_date"],
  ).sort();

  const metricsParams = reduce(
    metricsSelected,
    (prev: string[], cur) => {
      return [...prev, cur.name];
    },
    [],
  ).sort();

  //xử lý filter params
  const filterParams = getFilter(dimensionFilter, metricFilter);
  const isFilterEqual = isEqual(filterParams, cacheFilter);
  if (!isFilterEqual) {
    setCache((prev) => ({ ...prev, filter: filterParams }));
  }

  const isDimensionEqual = isArraySubset(dimensionsParams, cacheDimensions);
  if (!isDimensionEqual) {
    setCache((prev) => ({ ...prev, dimensions: dimensionsParams }));
  }

  // >> Nếu filter metrics có metric mà metricsParams chưa có >> truyền metric đó vào metricsParams
  const filterMetricsKey = map(metricFilter?.filterSet, (item) => item.key || "");
  const metricsFilterParams = uniq([...metricsParams, ...filterMetricsKey]);
  const isMetricEqual = isArraySubset(metricsFilterParams, cacheMetrics);
  if (!isMetricEqual) {
    setCache((prev) => ({ ...prev, metrics: metricsFilterParams }));
  }
  return {
    isDimensionEqual,
    isFilterEqual,
    isMetricEqual,
    filterParams,
    dimensionsParams,
    metricsParams,
    metricsFilterParams,
  };
};
