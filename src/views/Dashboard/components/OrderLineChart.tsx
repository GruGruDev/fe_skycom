import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { LineChart } from "@mui/x-charts/LineChart";
import { DASHBOARD_LABEL } from "constants/dashboard/label";
import { WIDTH_DEVICE } from "constants/index";
import { useMemo, useState } from "react";
import { TSelectOption } from "types/SelectOption";
import { fDate } from "utils/date";
import { fNumber, fShortenNumber } from "utils/number";
import { TReportOrderRevenue } from "..";

type Props = {
  reportData: TReportOrderRevenue[];
};

const options: TSelectOption[] = [
  { value: "total_order", label: DASHBOARD_LABEL.total_order },
  { value: "total_price_actual", label: DASHBOARD_LABEL.total_price_actual },
  // { value: "total_lead", label: DASHBOARD_LABEL.total_lead_assigned },
  // { value: "lead_qualified", label: DASHBOARD_LABEL.lead_qualified },
  // { value: "purchase_rate", label: DASHBOARD_LABEL.purchase_rate },
  // { value: "conversion_rate", label: DASHBOARD_LABEL.conversion_rate },
];

const OrderLineChart = (props: Props) => {
  const { reportData } = props;
  const [leftColumn, _setLeftColumn] = useState<TSelectOption>(options[0]);
  const [rightColumn, _setRightColumn] = useState<TSelectOption>(options[1]);

  // const handleChangeOption = (column: "left" | "right", value: ValueSelectorType) => {
  //   const newOption = options.find((item) => item.value === value) as TSelectOption;
  //   if (column === "left") {
  //     setLeftColumn(newOption);
  //   } else {
  //     setRightColumn(newOption);
  //   }
  // };

  const defaultData: Partial<TReportOrderRevenue>[] = useMemo(
    () => [
      {
        [leftColumn.value.toString()]: 0,
        [rightColumn.value.toString()]: 0,
        date: new Date().toString(),
      },
      {
        [leftColumn.value.toString()]: 0,
        [rightColumn.value.toString()]: 0,
        date: new Date().toString(),
      },
    ],
    [leftColumn.value, rightColumn.value],
  );

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        {/* <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={1}>
          <MultiSelect
            options={options}
            onChange={(value) => handleChangeOption("left", value)}
            value={leftColumn.value}
            simpleSelect
            selectorId="report-dashboard-left-column"
          />
          <MultiSelect
            options={options}
            onChange={(value) => handleChangeOption("right", value)}
            value={rightColumn.value}
            simpleSelect
            selectorId="report-dashboard-right-column"
          />
        </Stack> */}
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              dataKey: "date",
              valueFormatter: (value) => `${fDate(value)}`,
            },
          ]}
          series={[
            {
              dataKey: leftColumn.value.toString(),
              label: DASHBOARD_LABEL[leftColumn.value.toString() as keyof typeof DASHBOARD_LABEL],
              yAxisKey: leftColumn.value.toString(),
              showMark: false,
            },
            {
              dataKey: rightColumn.value.toString(),
              label: DASHBOARD_LABEL[rightColumn.value.toString() as keyof typeof DASHBOARD_LABEL],
              yAxisKey: rightColumn.value.toString(),
              showMark: false,
              valueFormatter: (value) => fShortenNumber(value).toString(),
            },
          ]}
          dataset={reportData.length ? reportData : (defaultData as any)}
          yAxis={[
            { id: leftColumn.value.toString(), valueFormatter: (value) => fNumber(value) },
            {
              id: rightColumn.value.toString(),
              valueFormatter: (value) => fShortenNumber(value).toString(),
            },
          ]}
          rightAxis={rightColumn.value.toString()}
          height={WIDTH_DEVICE > 600 ? 600 : WIDTH_DEVICE}
          margin={{ left: 30, right: 45 }}
        />
      </CardContent>
    </Card>
  );
};

export default OrderLineChart;
