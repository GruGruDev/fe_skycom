import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Span } from "components/Texts";
import { TColumn } from "types/DGrid";
import { PaletteColor } from "types/Styles";
import { fNumber } from "utils/number";
import { sumAndAvgMetric } from "./utils/sumAndAvgMetric";

type Props = {
  /**
   * rows sau khi đã qua filter
   */
  rows?: any;
  /**
   * ngày so sánh báo cáo
   */
  reportRangeDateCompare?: {
    created_from?: string | undefined;
    created_to?: string | undefined;
  };
  coefficient?: number;
  column?: TColumn;
};

const SummaryColumn = (props: Props) => {
  const { rows = [], reportRangeDateCompare, coefficient = 1, column = { name: "" } } = props;

  const summaryTotal = {
    value: sumAndAvgMetric({
      coefficient,
      columnName: column.name,
      data: rows,
      iteratee: column.name,
    }),
    compare: reportRangeDateCompare?.created_from
      ? sumAndAvgMetric({
          coefficient,
          columnName: column.name,
          data: rows,
          iteratee: `compare.${column.name}`,
        })
      : 0,
  };

  const compareValue = summaryTotal?.compare || 0;
  const compareColor: PaletteColor =
    compareValue > (summaryTotal?.value || 0)
      ? "success"
      : compareValue === summaryTotal?.value
        ? "info"
        : "error";

  const different = compareValue - parseInt(`${summaryTotal?.value}`);
  const percent = summaryTotal?.value
    ? parseFloat(`${(different * 100) / parseInt(`${summaryTotal?.value}`)}`).toFixed(1)
    : "";

  return (
    <Box>
      <Typography style={styles.total} color="text.primary">
        {fNumber(summaryTotal?.value)}
      </Typography>
      <Box mt={0.5}>
        {reportRangeDateCompare && (
          <Span color={compareColor}>
            {fNumber(summaryTotal?.compare)} {`(${percent}%)`}
          </Span>
        )}
      </Box>
    </Box>
  );
};

export default SummaryColumn;

const styles = {
  total: { fontSize: "0.82rem", fontWeight: "bold" },
};
