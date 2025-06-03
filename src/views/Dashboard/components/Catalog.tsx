import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { LineChart } from "@mui/x-charts/LineChart";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { fDate } from "utils/date";
import { TReportOrderRevenue } from "..";
import { useMemo } from "react";

type Props = {
  title: string;
  value: number | string;
  subTitle?: string;
  subValue?: string | number;
  xLabel: string;
  chartData?: TReportOrderRevenue[];
  loading?: boolean;
  icon?: React.ReactNode | JSX.Element;
};

const Catalog = (props: Props) => {
  const { title, value, subTitle, subValue, xLabel, chartData, loading, icon } = props;

  const defaultData: Partial<TReportOrderRevenue>[] = useMemo(
    () => [
      { [xLabel]: 0, date: new Date().toString() },
      { [xLabel]: 0, date: new Date().toString() },
    ],
    [xLabel],
  );

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardContent sx={{ p: 2, paddingBottom: "16px !important" }}>
        {loading && <LinearProgress />}
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Stack direction={"row"} alignItems={"center"}>
          {icon}
          <Typography variant="h5" component="div" sx={{ ml: 1 }}>
            {value}
          </Typography>
        </Stack>
        {subTitle && (
          <Typography sx={{ mt: 1.5, fontSize: 12 }} color="text.secondary">
            {subTitle}
          </Typography>
        )}
        <Typography variant="body2">{subValue}</Typography>
        {chartData && chartData.length > 1 ? (
          <LineChart
            slotProps={{ legend: { hidden: true } }}
            bottomAxis={null}
            leftAxis={null}
            xAxis={[
              {
                scaleType: "point",
                dataKey: "date",
                valueFormatter: (value) => `${fDate(value)}`,
              },
            ]}
            series={[
              {
                dataKey: xLabel,
                label: DASHBOARD_LABEL[xLabel as keyof typeof DASHBOARD_LABEL],
                showMark: false,
              },
            ]}
            dataset={chartData?.length ? chartData : (defaultData as any)}
            height={60}
            margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default Catalog;
