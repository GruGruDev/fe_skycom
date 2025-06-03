import { LineChart } from "@mui/x-charts/LineChart";
import { LineSeriesType } from "@mui/x-charts/models";
import { MakeOptional } from "@mui/x-date-pickers/internals";
import { warehouseApi } from "apis/warehouse";
import Stack from "@mui/material/Stack";
import { TitleGroup } from "components/Texts";
import { YYYY_MM_DD } from "constants/time";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import dayjs from "dayjs";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { fDate } from "utils/date";
import { MultiSelect } from "components/Selectors";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { TSelectOption } from "types/SelectOption";
import { revertFromQueryForSelector } from "utils/param";
import { formatOptionSelect } from "utils/option";
import { ALL_OPTION } from "constants/index";
import { RangeDate } from "components/Pickers";

const initParams: TParams = {
  dateValue: -1,
  date_from: dayjs(new Date()).startOf("month").format(YYYY_MM_DD),
  date_to: dayjs(new Date()).format(YYYY_MM_DD),
  limit: 1000,
  page: 1,
};

interface CategoryInventory {
  date: string;
  category: {
    id: string;
    name: string;
    total_quantity: 59;
  }[];
}
interface CategoryInventoryReport {
  date: string;
  [key: string]: number | string;
}

const CategoryInventoryChart = () => {
  const { warehouses } = useAppSelector(getDraftSafeSelector("warehouses"));
  const { category } = useAppSelector(getDraftSafeSelector("product")).attributes;
  const [data, setData] = useState<TDGridData<CategoryInventoryReport>>({
    count: 0,
    data: [],
    loading: false,
  });
  const [series, setSeries] = useState<MakeOptional<LineSeriesType, "type">[]>([]);
  const [params, setParams] = useState<TParams>(initParams);

  const formatData = useCallback((data: CategoryInventory[]): CategoryInventoryReport[] => {
    let result: CategoryInventoryReport[] = [];
    data.map((item, index) => {
      result[index] = { ...result[index], date: item.date };
      item.category.forEach((category) => {
        result[index] = { ...result[index], [category.id]: category.total_quantity };
      });
    });
    return result;
  }, []);

  const formatSeries = useCallback(
    (data: CategoryInventory["category"]): MakeOptional<LineSeriesType, "type">[] => {
      return data.map((item) => ({
        dataKey: item.id,
        label: item.name,
        showSymbol: false,
        smooth: true,
        showMark: false,
      }));
    },
    [],
  );

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await warehouseApi.get<CategoryInventory>({
      params,
      endpoint: "inventory/category/report/",
    });
    if (res.data) {
      const { results = [] } = res.data;

      setSeries(formatSeries(results[0]?.category || []));

      setData((prev) => ({
        ...prev,
        data: formatData(results),
        count: results[0]?.category?.length || 0,
        loading: false,
      }));

      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getData();
  }, [getData]);

  const warehouseOptions = reduce(
    warehouses,
    (prev: TSelectOption[], cur) => {
      if (cur.name && cur.id) {
        return [...prev, { label: cur.name, value: cur.id }];
      }
      return prev;
    },
    [],
  );

  const categoryOptions = useMemo(() => {
    return reduce(category, (prev: TSelectOption[], cur) => [...prev, formatOptionSelect(cur)], []);
  }, [category]);

  return (
    <Stack p={2}>
      <TitleGroup>{WAREHOUSE_LABEL.report_inventory_by_category}</TitleGroup>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={2}
        width={"100%"}
        justifyContent={"center"}
        mt={2}
      >
        <MultiSelect
          selectorId="warehouse_id"
          options={[ALL_OPTION, ...warehouseOptions]}
          title={WAREHOUSE_LABEL.warehouse}
          onChange={(value) => setParams((prev) => ({ ...prev, warehouse_id: value }))}
          value={revertFromQueryForSelector(params.warehouse_id)}
        />
        <MultiSelect
          selectorId="category_id"
          options={[ALL_OPTION, ...categoryOptions]}
          title={WAREHOUSE_LABEL.category}
          onChange={(value) => setParams((prev) => ({ ...prev, category_id: value }))}
          value={revertFromQueryForSelector(params.category_id)}
        />
        <RangeDate
          created_from={params.date_from as any}
          created_to={params.date_to as any}
          defaultDateValue={params.dateValue as any}
          standard
          handleSubmit={(from, to, value) =>
            setParams((prev) => ({ ...prev, date_from: from, date_to: to, dateValue: value }))
          }
        />
      </Stack>
      {data.data ? (
        <LineChart
          slotProps={{
            legend: {
              position: { horizontal: "middle", vertical: "bottom" },
              itemMarkWidth: 8,
              itemMarkHeight: 8,
              markGap: 5,
              itemGap: 10,
              labelStyle: { fontSize: 14, fontWeight: "400", paddingRight: 20 },
            },
          }}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "date",
              valueFormatter: (value) => `${fDate(value)}`,
            },
          ]}
          series={series}
          dataset={data.data as any}
          height={500}
          margin={{ top: 52, left: 52, bottom: 125, right: 52 }}
        />
      ) : null}
    </Stack>
  );
};

export default CategoryInventoryChart;
