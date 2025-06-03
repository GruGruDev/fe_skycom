import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import { orderApi } from "apis/order";
import { TableWrapper } from "components/Table";
import {
  REVENUE_BY_SOURCE_COLUMNS,
  REVENUE_BY_SOURCE_COLUMN_WIDTH,
} from "constants/dashboard/columnts";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { useCancelToken } from "hooks/useCancelToken";
import useTable from "hooks/useTable";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { DefaultizedPieValueType } from "@mui/x-charts/models";
import { NoDataPanel } from "components/NoDataPanel";
import { MultiSelect } from "components/Selectors";
import { LABEL } from "constants/label";
import { fNumber } from "utils/number";

type Props = {
  params: TParams;
};

const REPORT_OPTIONS: TSelectOption[] = [
  { value: "paid", label: DASHBOARD_LABEL.paid },
  { value: "price_pre_paid", label: DASHBOARD_LABEL.price_pre_paid },
  { value: "price_total_order_actual", label: DASHBOARD_LABEL.price_total_order_actual },
  { value: "price_total_variant_all", label: DASHBOARD_LABEL.price_total_variant_all },
  { value: "total_order", label: DASHBOARD_LABEL.total_order },
];

interface TReportSale {
  paid: number; // số tiền thanh toán đã xác nhận
  price_pre_paid: number; // số tiền thanh toán trước
  price_total_order_actual: number;
  price_total_variant_all: number;
  source_id: string;
  source_name: string;
  total_order: number;
}

const getArcLabel = (params: DefaultizedPieValueType, total: number) => {
  const percent = (params.value * 100) / total;
  return `${percent.toFixed(0)}%`;
};

const RevenueBySource = (props: Props) => {
  const tableProps = useTable({
    columns: REVENUE_BY_SOURCE_COLUMNS,
    columnWidths: REVENUE_BY_SOURCE_COLUMN_WIDTH,
  });

  const [data, setData] = useState<TDGridData<TReportSale>>({ count: 0, data: [], loading: false });
  const [params, setParams] = useState<TParams>({ limit: 30, page: 1 });
  const [reportOption, setReportOption] = useState<keyof TReportSale>("price_total_order_actual");

  const { newCancelToken } = useCancelToken([params]);
  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const res = await orderApi.get<TReportSale>({
      endpoint: "reports/revenue/source",
      params: { ...params, cancelToken: newCancelToken() },
    });
    if (res.data) {
      const { results = [], count = 0, total } = res.data;

      setData((prev) => ({ ...prev, data: results, count, total, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setParams((prev) => ({ ...prev, ...props.params }));
  }, [props.params]);

  const chartData = useMemo(() => {
    return reduce(
      data.data,
      (prev: TSelectOption[], cur) => {
        return [...prev, { value: cur[reportOption], label: cur.source_name }];
      },
      [],
    );
  }, [data.data, reportOption]);

  return (
    <Card sx={{ width: "100%", marginTop: 2 }}>
      <CardContent sx={{ padding: 0 }}>
        <Grid container>
          <Grid item xs={12} md={7} lg={6} xl={8}>
            <Typography fontSize={18} fontWeight={"bold"} m={2}>
              {DASHBOARD_LABEL.revenue_by_source}
            </Typography>
            <TableWrapper
              {...tableProps}
              heightTable={400}
              data={data}
              hiddenPagination
              params={params}
              setParams={setParams}
              summaryColumns={[
                { columnName: "source_name", type: "sum" },
                { columnName: "paid", type: "sum" },
                { columnName: "price_pre_paid", type: "sum" },
                { columnName: "price_total_order_actual", type: "sum" },
                { columnName: "price_total_variant_all", type: "sum" },
                { columnName: "total_order", type: "sum" },
              ]}
              totalRow={{ ...data.total, source_name: LABEL.TOTAL }}
              SummaryColumnsComponent={(params) => {
                let result: string | number = "";

                if (typeof params.row[params.column?.name || ""] === "number")
                  result = fNumber(params.row[params.column?.name || ""]);
                else result = params.row[params.column?.name || ""];
                return <h3>{result}</h3>;
              }}
            />
          </Grid>
          <Grid item xs={12} md={5} lg={6} xl={4}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography fontSize={18} fontWeight={"bold"} m={2}>
                {DASHBOARD_LABEL.chart_revenue_by_source}
              </Typography>
              <MultiSelect
                options={REPORT_OPTIONS}
                outlined
                value={reportOption}
                onChange={(value) => setReportOption(value?.toString() as keyof TReportSale)}
                simpleSelect
                // eslint-disable-next-line no-inline-styles/no-inline-styles
                style={{ margin: 20 }}
              />
            </Stack>
            {chartData.length ? (
              <PieChart
                series={[
                  {
                    data: chartData as any,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 5, additionalRadius: -5, color: "gray" },
                    arcLabel: (params) => getArcLabel(params, data.total?.[reportOption] || 1),
                    arcLabelMinAngle: 5,
                    arcLabelRadius: "70%",
                  },
                ]}
                height={250}
              />
            ) : (
              <NoDataPanel containerSx={{ height: 200 }} />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RevenueBySource;
