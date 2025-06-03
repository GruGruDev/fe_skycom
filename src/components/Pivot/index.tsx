import { Filter } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DragDropContainer from "components/Dnd";
import { WrapPage } from "components/Page";
import { ALL_OPTION } from "constants/index";
import useTable, { TableProps } from "hooks/useTable";
import isEqual from "lodash/isEqual";
import map from "lodash/map";
import reduce from "lodash/reduce";
import sortBy from "lodash/sortBy";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { TColumn, TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { TPivotCache, TPivotDateFilter, TPivotFilterExtension } from "types/Pivot";
import { TSelectOption } from "types/SelectOption";
import { fDate } from "utils/date";
import FilterSet from "./Filter/FilterSet";
import { AirTableColumn, AirTableColumnTypes } from "./Filter/types";
import PivotGrid, { PivotGridProps } from "./PivotGrid";
import PivotHeader, { PivotHeaderProps } from "./PivotHeader";
import PivotSeting, { PivotSetingProps } from "./PivotSeting";
import { checkCacheParamsToGetReport } from "./utils/checkCacheParamsToGetReport";
import { coefficientByDateView } from "./utils/coefficientByDateView";
import { convertGroupKey } from "./utils/convertGroupKey";
import { filterColumn } from "./utils/filterColumn";
import { PIVOT_LABEL } from "constants/pivot/label";
import { LABEL } from "constants/label";
import { findOption } from "utils/option";

export interface PivotProps
  extends Pick<PivotGridProps, "endDemensionColumn" | "endDemensionColumnWidth" | "data">,
    Pick<PivotSetingProps, "dimensionFilterColumns">,
    Omit<PivotHeaderProps, "onChangeDate"> {
  dimensions: TColumn[];
  metrics: TColumn[];
  getReport: (params: TParams) => void;
  getReportCompare?: (params: TParams, isReset?: boolean) => void;
  /**
   * cung các danh sách cột không áp dụng filter mặc định mà thông qua hàm onFilterColumnExtensions
   */
  filterColumnExtensions?: { columnName: string; options: TSelectOption[] }[];
  /**
   *
   * @param filter thuộc filterColumnExtensions để áp dụng các logic filter thuộc mỗi bảng report khác nhau
   * @returns boolean
   * @description nếu `true` thì dữ liệu được show trong bảng, nếu `false` thì dữ liệu không show trong bảng
   */
  onFilterColumnExtensions?: (filter: TPivotFilterExtension) => boolean;
}

interface PivotContextType extends Partial<TableProps> {
  expandedRowIdsByGroup: {
    [key: string]: (string | number)[];
  };
  onExpandedRowIdsChangeByGroup: React.Dispatch<
    React.SetStateAction<{
      [key: string]: (string | number)[];
    }>
  >;
  dateView: TSelectOption;
  coefficient: number;
  isShowChart?: boolean;
  isShowPivot?: boolean;
  reportRangeDate?: { created_from?: string; created_to?: string };
  reportRangeDateCompare?: { created_from?: string; created_to?: string };
  filterColumnExtensions?: { columnName: string; options: TSelectOption[] }[];
}

let rangeDateLabel = "";

export const PivotContext = createContext<PivotContextType | null>(null);

/**
 * children là danh sách các column component
 */
const Pivot = (props: PivotProps) => {
  const [data, setData] = useState<Partial<TDGridData<any>> | undefined>({
    data: [],
    count: 0,
    loading: false,
  });

  const [expandedRowIdsByGroup, onExpandedRowIdsChangeByGroup] = useState<{
    [key: string]: (string | number)[];
  }>({});

  const [dimensionsSelected, setDimensionsSelected] = useState<(TColumn & { width?: number })[]>(
    [],
  );
  const [metricsSelected, setMetricsSelected] = useState<(TColumn & { width?: number })[]>([]);
  const tableProps = useTable({ columns: [], columnWidths: [] });
  const [dateView, setDateView] = useState(ALL_OPTION);
  const [coefficient, setCoefficient] = useState(1); // số node trong chart

  const [metrics, setMetrics] = useState(props.metrics);
  const [dimensions, setDimentions] = useState(props.dimensions);
  const [dimensionFilter, setDimensionFilter] = useState<FilterSet>();
  const [metricFilter, setFilterMetric] = useState<FilterSet>();

  // lưu params đã gọi report
  const [cache, setCache] = useState<TPivotCache>({
    dimensions: [],
    metrics: [],
    date: {},
    filter: {
      b_expr_dims: "AND",
      b_expr_metrics: "AND",
      filters: "",
    },
  });

  const [rangeDate, setRangeDate] = useState<TPivotDateFilter>({});
  const [rangeDateCompare, setRangeDateCompare] = useState<TPivotDateFilter>();
  const [isShowChart, setIsShowChart] = useState(false);
  const [isShowPivot, setIsShowPivot] = useState(false);

  const handleChangeDimensions = (index: number) => {
    const newDimentions = [...dimensions];
    newDimentions[index] = {
      ...newDimentions[index],
      options: {
        selected: !newDimentions[index].options?.selected,
      },
    };

    setDimentions(newDimentions);
    const newDimensionSelected = reduce(
      newDimentions,
      (prev: typeof dimensionsSelected, cur) => {
        if (cur.options?.selected) {
          const column: TColumn = { ...cur, name: convertGroupKey(cur.name) };
          return [...prev, column];
        }
        return prev;
      },
      [],
    );
    setDimensionsSelected(newDimensionSelected);
  };
  const handleChangeMetrics = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics[index] = {
      ...newMetrics[index],
      options: {
        selected: !newMetrics[index].options?.selected,
      },
    };

    setMetrics(newMetrics);
    setMetricsSelected(newMetrics.filter((item) => item.options?.selected));
  };

  /**
   * !lấy report khi `không` tồn tại rangeDateCompare
   */
  const getReport = useCallback(async () => {
    if (rangeDateCompare) {
      return;
    }

    const {
      filterParams,
      isDimensionEqual,
      isFilterEqual,
      isMetricEqual,
      dimensionsParams,
      metricsFilterParams,
      metricsParams,
    } = checkCacheParamsToGetReport({
      cacheDimensions: cache.dimensions,
      cacheMetrics: cache.metrics,
      dimensionsSelected,
      metricsSelected,
      setCache,
      cacheFilter: cache.filter,
      dimensionFilter,
      metricFilter,
    });

    const isDateEqual = isEqual(rangeDate, cache.date);
    if (!isDateEqual) {
      setCache((prev) => ({ ...prev, date: rangeDate }));
    }

    const isDateCompareEqual = isEqual(rangeDateCompare, cache.dateCompare);
    if (!isDateCompareEqual) {
      setCache((prev) => ({ ...prev, dateCompare: rangeDateCompare }));
    }

    if (
      (!isDimensionEqual ||
        !isMetricEqual ||
        !isDateEqual ||
        !isDateCompareEqual ||
        !isFilterEqual) &&
      metricsParams.length // phải có metrics
    ) {
      props.getReport({
        dimensions: dimensionsParams,
        metrics: metricsFilterParams,
        ...rangeDate,
        ...filterParams,
      });
    }
  }, [
    dimensionsSelected,
    metricsSelected,
    cache,
    rangeDate,
    props,
    rangeDateCompare,
    dimensionFilter,
    metricFilter,
  ]);

  /**
   * !lấy report compare khi tồn tại rangeDateCompare
   */
  const getReportCompare = useCallback(async () => {
    if (!rangeDateCompare) {
      return;
    }

    const {
      filterParams,
      isDimensionEqual,
      isFilterEqual,
      isMetricEqual,
      dimensionsParams,
      metricsFilterParams,
      metricsParams,
    } = checkCacheParamsToGetReport({
      cacheDimensions: cache.dimensions,
      cacheMetrics: cache.metrics,
      dimensionsSelected,
      metricsSelected,
      setCache,
      cacheFilter: cache.filter,
      dimensionFilter,
      metricFilter,
    });

    const isDateCompareEqual = isEqual(rangeDateCompare, cache.dateCompare);
    if (!isDateCompareEqual) {
      setCache((prev) => ({ ...prev, dateCompare: rangeDateCompare }));
    }

    if (
      (!isDimensionEqual || !isMetricEqual || !isDateCompareEqual || !isFilterEqual) &&
      metricsParams.length // phải có metrics
    ) {
      props.getReportCompare?.(
        {
          ...rangeDate,
          ...filterParams,
          created_from_cp: rangeDateCompare?.created_from,
          created_to_cp: rangeDateCompare?.created_to,
          dimensions: dimensionsParams,
          metrics: metricsFilterParams,
        },
        !rangeDateCompare?.created_from,
      );
    }
  }, [
    dimensionsSelected,
    metricsSelected,
    cache,
    rangeDate,
    props,
    rangeDateCompare,
    dimensionFilter,
    metricFilter,
  ]);

  // tính số nút trong chart
  useEffect(() => {
    if (rangeDate?.created_from && rangeDate?.created_to) {
      rangeDateLabel = `${fDate(rangeDate.created_from)} - ${fDate(rangeDate.created_to)}`;
      setCoefficient(coefficientByDateView(dateView, rangeDate));
    } else {
      if (data?.data?.length) {
        const newData = sortBy(data?.data, props.endDemensionColumn.name);
        const rangeDate = {
          created_from: newData[0][props.endDemensionColumn.name],
          created_to: newData[newData.length - 1][props.endDemensionColumn.name],
        };
        rangeDateLabel = `${fDate(rangeDate.created_from)} - ${fDate(rangeDate.created_to)}`;
        setCoefficient(coefficientByDateView(dateView, rangeDate));
      }
    }
  }, [rangeDate, dateView, data?.data, props.endDemensionColumn.name]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  useEffect(() => {
    getReportCompare();
  }, [getReportCompare]);

  useEffect(() => {
    setMetrics(props.metrics);
  }, [props.metrics]);

  useEffect(() => {
    const data = {
      ...props.data,
      data:
        props.data?.data?.sort((a, b) =>
          a[props.endDemensionColumn.name].localeCompare(b[props.endDemensionColumn.name]),
        ) || [],
    };
    setData(data);
  }, [props.data, props.endDemensionColumn.name]);

  useEffect(() => {
    setDimentions(props.dimensions);
  }, [props.dimensions]);

  const positionDimensionByOrders = useMemo(
    () =>
      reduce(
        tableProps.columnOrders,
        (prevColumns: TColumn[], curColumn) => {
          const dimension = findOption(dimensionsSelected, curColumn, "name");
          return dimension ? [...prevColumns, dimension] : prevColumns;
        },
        [],
      ),
    [tableProps.columnOrders, dimensionsSelected],
  );

  const positionMetricByOrders = useMemo(
    () =>
      reduce(
        tableProps.columnOrders,
        (prevColumns: TColumn[], curColumn) => {
          const metric = findOption(metricsSelected, curColumn, "name");

          return metric ? [...prevColumns, metric] : prevColumns;
        },
        [],
      ),
    [tableProps.columnOrders, metricsSelected],
  );

  const metricFilterColumns: AirTableColumn[] = map([...metrics], (metric) => {
    return {
      width: 200,
      name: metric.title || metric.name,
      key: metric.name,
      id: metric.name,
      type: AirTableColumnTypes.NUMBER,
    };
  });

  const columnFilterExtensions = map(
    [{ name: props.endDemensionColumn.name }, ...dimensionsSelected, ...metricsSelected],
    (item) => ({
      columnName: item.name,
      predicate: (value: any, filter: Filter) =>
        filterColumn(value, filter, props.filterColumnExtensions, props.onFilterColumnExtensions),
    }),
  );

  return (
    <PivotContext.Provider
      value={{
        expandedRowIdsByGroup,
        onExpandedRowIdsChangeByGroup,
        dateView,
        coefficient,
        isShowChart,
        isShowPivot,
        // lấy từ rangeDate hoặc lấy từ data
        reportRangeDate: {
          created_from: rangeDate.created_from || data?.data?.[0]?.[props.endDemensionColumn.name],
          created_to:
            rangeDate.created_to ||
            data?.data?.[(data?.data.length || 0) - 1]?.[props.endDemensionColumn.name],
        },
        reportRangeDateCompare: rangeDateCompare,
        filterColumnExtensions: props.filterColumnExtensions,
        ...tableProps,
      }}
    >
      <WrapPage>
        <Stack spacing={2} padding={2}>
          <PivotHeader
            isFullRow={tableProps.isFullRow}
            setFullRow={tableProps.setFullRow}
            exportExcel={{ fileName: "report_pivot", data: data?.data }}
          />

          <PivotSeting
            dimensionFilterColumns={props.dimensionFilterColumns}
            metricFilterColumns={metricFilterColumns}
            isShowChart={isShowChart}
            onShowChart={setIsShowChart}
            isShowPivot={isShowPivot}
            onShowPivot={setIsShowPivot}
            dimensions={dimensions}
            metrics={metrics}
            dimensionFilter={dimensionFilter}
            metricFilter={metricFilter}
            onChangeDimensions={handleChangeDimensions}
            onChangeMetrics={handleChangeMetrics}
            onChangeDateView={setDateView}
            onChangeFilterDimension={setDimensionFilter}
            onChangeFilterMetric={setFilterMetric}
            reportDate={{
              date_from: rangeDate.created_from,
              date_to: rangeDate.created_to,
              dateValue: rangeDate.dateValue,
            }}
            onChangeDate={(date) => {
              setRangeDate({
                created_from: date.date_from,
                created_to: date.date_to,
                dateValue: date.dateValue,
              });
            }}
            compareDate={
              rangeDateCompare
                ? {
                    date_from: rangeDateCompare.created_from,
                    date_to: rangeDateCompare.created_to,
                    dateValue: rangeDateCompare.dateValue,
                  }
                : undefined
            }
            onChangeCompareDate={(date) =>
              date
                ? setRangeDateCompare({
                    created_from: date.date_from,
                    created_to: date.date_to,
                    dateValue: date.dateValue,
                  })
                : setRangeDateCompare(undefined)
            }
            dateView={dateView}
          />
          <Box>
            <Typography fontSize="1rem">{`${LABEL.ORDER_OF_OBJECT_APPEARANCE}:`}</Typography>
            <DragDropContainer
              options={isShowPivot ? dimensionsSelected : positionDimensionByOrders}
              setOptions={setDimensionsSelected}
              containerProps={{
                direction: "row",
              }}
            />
          </Box>

          <Box>
            <Typography fontSize="1rem">{`${LABEL.ORDER_OF_DATA}:`}</Typography>
            <DragDropContainer
              options={isShowPivot ? metricsSelected : positionMetricByOrders}
              setOptions={setMetricsSelected}
              containerProps={{
                direction: "row",
              }}
            />
          </Box>
          <Box>
            <FormLabel
              style={styles.helperLabel}
              error={!dimensionsSelected.length || !metricsSelected.length}
            >
              {dimensionsSelected.length && metricsSelected.length
                ? `${PIVOT_LABEL.show_date}:  ${rangeDateLabel}`
                : isShowPivot
                  ? PIVOT_LABEL.require_dimension_metric
                  : ""}
            </FormLabel>
            <PivotGrid
              {...props}
              data={{
                ...data,
                data: data?.data || [],
                count: data?.count || 0,
              }}
              group={dimensionsSelected}
              columns={metricsSelected}
              isShowPivot={isShowPivot}
              columnFilterExtensions={columnFilterExtensions}
            />
          </Box>
        </Stack>
      </WrapPage>
    </PivotContext.Provider>
  );
};
export default Pivot;

const styles = {
  helperLabel: { fontSize: "0.82rem" },
};
