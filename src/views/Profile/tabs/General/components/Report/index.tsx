import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { orderApi } from "apis/order";
import { RangeDate } from "components/Pickers";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { YYYY_MM_DD } from "constants/time";
import dayjs from "dayjs";
import useAuth from "hooks/useAuth";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { compareDateSelected } from "utils/date";
import { fNumber } from "utils/number";
import { TReportOrderRevenue } from "views/Dashboard";
import Catalog from "views/Dashboard/components/Catalog";
import OrderLineChart from "views/Dashboard/components/OrderLineChart";
import OrderTable from "./OrderTable";

const Report = () => {
  const { user } = useAuth();

  const [params, setParams] = useState<TParams>({
    dateValue: -1,
    created_from: dayjs(new Date()).startOf("month").format(YYYY_MM_DD),
    created_to: dayjs(new Date()).format(YYYY_MM_DD),
  });

  const [data, setData] = useState<TDGridData<TReportOrderRevenue, TReportOrderRevenue>>({
    count: 0,
    data: [],
    loading: false,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await orderApi.get<TReportOrderRevenue>({
      endpoint: "reports/revenue/dashboard",
      params,
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

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (user?.id) {
      setParams((prev) => ({ ...prev, user_id: [user?.id] }));
    }
  }, [user?.id]);

  const {
    lead_qualified = 0,
    total_order = 0,
    total_order_completed = 0,
    total_price_actual = 0,
    total_price_actual_completed = 0,
    conversion_rate = 0,
    purchase_rate = 0,
    total_lead = 0,
  } = data.total || {};

  return (
    <Box my={3}>
      <Grid container justifyContent={"end"}>
        <RangeDate
          standard
          size="small"
          label={""}
          inputStyle={{ minWidth: 180 }}
          inputProps={{ variant: "outlined" }}
          created_from={params?.created_from as string}
          created_to={params?.created_to as string}
          defaultDateValue={params?.dateValue as number}
          handleSubmit={(created_from: string, created_to: string, dateValue: string | number) => {
            const {
              date_from,
              date_to,
              value: toValue,
            } = compareDateSelected(created_from, created_to, dateValue);
            setParams?.({
              ...params,
              created_from: date_from,
              created_to: date_to,
              dateValue: toValue,
            });
          }}
        />
      </Grid>
      {/* card */}
      <Grid container spacing={2} mt={2}>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="total_order"
            chartData={data.data}
            title={DASHBOARD_LABEL.total_order}
            value={fNumber(total_order)}
          />
        </Grid>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="total_order_completed"
            chartData={data.data}
            title={DASHBOARD_LABEL.total_order_completed}
            value={fNumber(total_order_completed)}
          />
        </Grid>

        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="purchase_rate"
            chartData={data.data}
            title={DASHBOARD_LABEL.purchase_rate}
            value={`${fNumber(purchase_rate)}%`}
          />
        </Grid>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="total_price_actual"
            chartData={data.data}
            title={DASHBOARD_LABEL.total_price_actual}
            value={fNumber(total_price_actual)}
          />
        </Grid>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="total_price_actual_completed"
            chartData={data.data}
            title={DASHBOARD_LABEL.total_price_actual_completed}
            value={fNumber(total_price_actual_completed)}
          />
        </Grid>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="total_lead"
            chartData={data.data}
            title={DASHBOARD_LABEL.total_lead_assigned}
            value={fNumber(total_lead)}
          />
        </Grid>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="lead_qualified"
            chartData={data.data}
            title={DASHBOARD_LABEL.lead_qualified}
            value={fNumber(lead_qualified)}
          />
        </Grid>
        <Grid item xs={6} md={4} xl={3}>
          <Catalog
            loading={data.loading}
            xLabel="conversion_rate"
            chartData={data.data}
            title={DASHBOARD_LABEL.conversion_rate}
            value={`${fNumber(conversion_rate)}%`}
          />
        </Grid>
      </Grid>
      <Grid container mt={2}>
        <Grid item xs={12}>
          <OrderLineChart reportData={data.data} />
        </Grid>
      </Grid>
      {/*  */}
      <Grid container mt={2} spacing={2}>
        <Grid item xs={12} md={6}>
          <OrderTable params={params} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Report;
