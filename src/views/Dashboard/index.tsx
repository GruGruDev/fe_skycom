import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";
import { IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { orderApi } from "apis/order";
import { PageWithTitle } from "components/Page";
import { RangeDate } from "components/Pickers";
import { calculateDaysBetweenDates } from "components/Pivot/utils/coefficientByDateView";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { PAGE_TITLE } from "constants/pageTitle";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { compareDateSelected } from "utils/date";
import { fNumber, fPercent, fShortenNumber } from "utils/number";
import Catalog from "./components/Catalog";
import OrderLineChart from "./components/OrderLineChart";
import TopProductTable from "./components/TopProductTable";
import TopTelesaleTable from "./components/TopTelesaleTable";

export interface TReportOrderRevenue {
  date: string;
  total_order: number;
  total_order_completed: number;
  total_price_actual: number;
  total_price_actual_completed: number;
  lead_qualified: number;
  purchase_rate: number;
  customer_return_rate: number;
  new_customer_total: number;
  conversion_rate: number;
  total_lead: number;
  lead_buy: number;
}

interface TRevenueInMonth {
  total_order_prev_month: number;
  total_price_actual_prev_month: number;
  total_order_current_month: number;
  total_price_actual_current_month: number;
  total_order_today: number;
  total_price_actual_today: number;
}

const initParams: TParams = {
  dateValue: -1,
  complete_time_from: dayjs(new Date()).startOf("month").format(YYYY_MM_DD),
  complete_time_to: dayjs(new Date()).format(YYYY_MM_DD),
};

const Dashboard = () => {
  const [params, setParams] = useState(initParams);
  const [data, setData] = useState<TDGridData<TReportOrderRevenue, TReportOrderRevenue>>({
    count: 0,
    data: [],
    loading: false,
  });

  const [revenueInMonth, setRevenueInMonth] = useState<
    Partial<TRevenueInMonth & { loading: boolean }>
  >({
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await orderApi.get<TReportOrderRevenue>({
      endpoint: "reports/revenue/dashboard",
      params: {
        ...params,
        page: 1,
        limit: calculateDaysBetweenDates(
          params.complete_time_from as string,
          params.complete_time_to as string,
        ),
      },
    });
    if (res.data) {
      const { results = [], count = 0, total } = res.data;
      const data = reduce(
        results,
        (prev: TReportOrderRevenue[], cur) => {
          return [
            ...prev,
            {
              ...cur,
              purchase_rate: cur.purchase_rate * 100,
              conversion_rate: cur.conversion_rate * 100,
            },
          ];
        },
        [],
      );
      let formatTotal = total;
      if (total) {
        formatTotal = {
          ...total,
          purchase_rate: total.purchase_rate * 100,
          conversion_rate: total.conversion_rate * 100,
        };
      }
      setData((prev) => ({ ...prev, data, total: formatTotal, count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params]);

  const getRevenueInMonth = useCallback(async () => {
    setRevenueInMonth((prev) => ({ ...prev, loading: true }));
    const res = await orderApi.get<TRevenueInMonth>({
      endpoint: "reports/revenue/ratio",
    });
    if (res.data) {
      const { data } = res.data as any;
      setRevenueInMonth({ ...data, loading: false });
      return;
    }
    setRevenueInMonth((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getRevenueInMonth();
  }, [getRevenueInMonth]);

  const {
    total_order = 0,
    total_price_actual = 0,
    customer_return_rate = 0,
    new_customer_total = 0,
  } = data.total || {};

  const {
    total_order_current_month = 0,
    total_order_today = 0,
    total_price_actual_current_month = 0,
    total_price_actual_today = 0,
  } = revenueInMonth;

  const total_order_prev_month = revenueInMonth.total_order_prev_month || 1;
  const total_price_actual_prev_month = revenueInMonth.total_price_actual_prev_month || 1;

  return (
    <PageWithTitle title={PAGE_TITLE.dashboard}>
      <Grid container spacing={[1, 2]} py={4}>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={revenueInMonth.loading}
            xLabel="total_order_current_month"
            title={DASHBOARD_LABEL.total_order_current_month}
            value={fNumber(total_order_current_month)}
            icon={<LocalGroceryStoreIcon color="primary" />}
            subTitle={DASHBOARD_LABEL.compare_prev_month}
            subValue={`${fPercent(total_order_current_month / total_order_prev_month)}`}
          />
        </Grid>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={revenueInMonth.loading}
            xLabel="total_price_actual_current_month"
            title={DASHBOARD_LABEL.total_price_actual_current_month}
            value={fShortenNumber(total_price_actual_current_month)}
            icon={<ShapeLineIcon color="primary" />}
            subTitle={DASHBOARD_LABEL.compare_prev_month}
            subValue={fPercent(total_price_actual_current_month / total_price_actual_prev_month)}
          />
        </Grid>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={revenueInMonth.loading}
            xLabel="total_order_today"
            title={DASHBOARD_LABEL.total_order_today}
            value={fNumber(total_order_today)}
          />
        </Grid>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={revenueInMonth.loading}
            xLabel="total_price_actual_total"
            title={DASHBOARD_LABEL.total_price_actual_today}
            value={fNumber(total_price_actual_today)}
          />
        </Grid>
      </Grid>
      <Stack direction={"row"} justifyContent={"end"} my={2}>
        <Grid item>
          <IconButton onClick={() => setParams({ ...params })}>
            <RefreshIcon />
          </IconButton>
        </Grid>
        <RangeDate
          defaultDateValue={params.dateValue as number}
          created_from={params?.complete_time_from as string}
          created_to={params?.complete_time_to as string}
          handleSubmit={(from: string, to: string, dateValue: string | number) => {
            const { date_from, date_to, value } = compareDateSelected(from, to, dateValue);
            setParams({
              ...params,
              complete_time_from: date_from,
              complete_time_to: date_to,
              dateValue: value,
            });
          }}
        />
      </Stack>
      <Grid container spacing={[1, 2]}>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={data.loading}
            chartData={data.data}
            xLabel="total_order"
            title={DASHBOARD_LABEL.total_order}
            value={fNumber(total_order)}
            icon={<LocalGroceryStoreIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={data.loading}
            chartData={data.data}
            xLabel="total_price_actual"
            title={DASHBOARD_LABEL.total_price_actual}
            value={fShortenNumber(total_price_actual)}
            icon={<ShapeLineIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={data.loading}
            chartData={data.data}
            xLabel="new_customer_total"
            title={DASHBOARD_LABEL.new_customer_total}
            value={fNumber(new_customer_total)}
            icon={<PersonAddIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={6} md={3} xl={3}>
          <Catalog
            loading={data.loading}
            chartData={data.data}
            xLabel="customer_return_rate"
            title={DASHBOARD_LABEL.customer_return_rate}
            value={fNumber(customer_return_rate)}
            icon={<AdminPanelSettingsIcon color="primary" />}
          />
        </Grid>
      </Grid>
      <Grid container mt={[2, 4]}>
        <Grid item xs={12}>
          <OrderLineChart reportData={data.data} />
        </Grid>
      </Grid>
      <Grid container mt={[0, 2]} mb={4} spacing={2}>
        <Grid item xs={12} lg={6}>
          <TopProductTable params={params} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TopTelesaleTable params={params} />
        </Grid>
        {/* <Grid item xs={12}>
          <RevenueBySource params={params} />
        </Grid> */}
      </Grid>
    </PageWithTitle>
  );
};

export default Dashboard;
