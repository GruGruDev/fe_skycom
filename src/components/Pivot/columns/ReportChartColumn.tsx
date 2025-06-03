import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";
import { Span } from "components/Texts";
import { useContext } from "react";
import { TColumn } from "types/DGrid";
import { PaletteColor } from "types/Styles";
import { fDate } from "utils/date";
import { forOf } from "utils/forOf";
import { fNumber } from "utils/number";
import { PivotContext } from "..";
import { generateDateArray } from "../utils/generalDateArray";

export interface ReportChartColumnProps {
  endDemensionColumn: TColumn;
  group?: TColumn;
}

interface Props extends ReportChartColumnProps {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const ReportChartColumn = (props: Props) => {
  const Formatter = ({
    value = 0,
    row,
    column,
  }: {
    value: string | number;
    row?: any;
    column: TColumn;
  }) => {
    const pivotContext = useContext(PivotContext);
    const isShowChart = pivotContext?.isShowChart;

    // const dataY = map(data, (item) => item[column.name]);
    let dataY: number[] = [];
    let dataCompareY: number[] = [];
    // const dataX = map(data, (item) => item[props.endDemensionColumn.name]);
    let dataX: Date[] = [];
    let dataCompareX: Date[] = [];

    const arrayDay = generateDateArray(
      pivotContext?.reportRangeDate?.created_from,
      pivotContext?.reportRangeDate?.created_to,
    );

    const arrayDayCompare = generateDateArray(
      pivotContext?.reportRangeDateCompare?.created_from,
      pivotContext?.reportRangeDateCompare?.created_to,
    );

    forOf(arrayDay, (cur) => {
      // tìm dữ liệu trong ngày đúng với ngày query từ api
      const dataByDate = row?.data?.find(
        (item: any) => fDate(item[props.endDemensionColumn.name]) === fDate(cur),
      );
      dataY = [...dataY, dataByDate ? dataByDate[column.name] : 0];
      dataX = [...dataX, cur];
    });

    forOf(arrayDayCompare, (cur) => {
      // tìm dữ liệu trong ngày đúng với ngày query từ api
      const dataByDate = row?.data?.find(
        (item: any) => fDate(item?.compare?.[props.endDemensionColumn.name]) === fDate(cur),
      );
      dataCompareY = [...dataCompareY, dataByDate ? dataByDate?.compare?.[column.name] || 0 : 0];
      dataCompareX = [...dataCompareX, cur];
    });

    const compareValue = row?.compare?.[`${column.name}`] || 0;
    const compareColor: PaletteColor =
      compareValue > value ? "success" : compareValue === value ? "info" : "error";

    const different = compareValue - parseInt(`${value}`);
    const percent = value
      ? parseFloat(`${(different * 100) / parseInt(`${value}`)}`).toFixed(1)
      : "";

    return (
      <Box>
        <Typography fontSize="0.82rem">{fNumber(value)}</Typography>
        {pivotContext?.reportRangeDateCompare && (
          <Span color={compareColor}>
            {fNumber(row?.compare?.[`${column.name}`])} {`(${percent}%)`}
          </Span>
        )}
        {props.group && isShowChart && (arrayDay.length || arrayDayCompare.length) ? (
          <LineChart
            sx={{
              ".MuiLineElement-root": {
                strokeWidth: 1.5,
              },
              ".MuiMarkElement-root": {
                scale: "0.5",
                fill: "#fff",
                strokeWidth: 1.5,
              },
            }}
            margin={{ top: 5, left: 5, bottom: 5, right: 5 }}
            width={240}
            height={80}
            series={[
              { data: dataY, label: column.title, color: "#DA03FF" },
              { data: dataCompareY, label: column.title, color: "#31B2AF" },
            ]}
            xAxis={[
              {
                data: dataX,
                valueFormatter: (value) => fDate(value) as string,
                hideTooltip: true,
              },
              {
                data: dataCompareX,
                valueFormatter: (value) => fDate(value) as string,
                hideTooltip: true,
              },
            ]}
            bottomAxis={null}
            leftAxis={null}
            slots={{
              popper: (props) => {
                const index: number = (props.children as any).props.axisData.x.index;
                return (
                  <Popper
                    {...props}
                    placement="right-end"
                    sx={{ zIndex: 1500, margin: "4px !important" }}
                  >
                    <Box
                      p={2}
                      sx={{
                        marginLeft: 1,
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography>{column.title}</Typography>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={2}
                        sx={{ div: { backgroundColor: "#DA03FF" } }}
                      >
                        <div style={styles.legend} />
                        <Typography fontSize="0.82rem">{fDate(dataX[index])}</Typography>
                        <Typography fontSize="0.82rem" fontWeight={"bold"}>
                          {fNumber(dataY[index])}
                        </Typography>
                      </Stack>
                      {dataCompareX.length && dataCompareY.length ? (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          spacing={2}
                          sx={{ div: { backgroundColor: "#31B2AF" } }}
                        >
                          <div style={styles.legend} />
                          <Typography fontSize="0.82rem">{fDate(dataCompareX[index])}</Typography>
                          <Typography fontSize="0.82rem" fontWeight={"bold"}>
                            {fNumber(dataCompareY[index])}
                          </Typography>
                        </Stack>
                      ) : null}
                    </Box>
                  </Popper>
                );
              },
            }}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        ) : null}
      </Box>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

const styles = {
  legend: { width: 8, height: 8, borderRadius: 4 },
};
