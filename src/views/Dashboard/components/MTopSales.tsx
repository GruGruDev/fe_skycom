import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NoDataPanel } from "components/NoDataPanel";
import { TStyles } from "types/Styles";
import { fNumber } from "utils/number";
import { TReportSale } from "./TopTelesaleTable";
import { getTopHighlightColor } from "utils/color";

type Props = {
  listSales: TReportSale[];
  loading?: boolean;
};

const MTopSale = ({ listSales = [], loading = false }: Props) => {
  return listSales.length === 0 ? (
    <NoDataPanel containerSx={{ p: 2 }} loading={loading} showImage />
  ) : (
    <Grid container gap={0.5} px={2}>
      {listSales.map((item, index) => (
        <Grid
          key={index}
          item
          xs={12}
          borderBottom={"1px dashed"}
          borderColor={"divider"}
          p={1}
          sx={{ backgroundColor: getTopHighlightColor(index) }}
        >
          <Stack direction="row" alignItems={"center"} spacing={1}>
            <Typography fontSize={"0.825rem"}>{item.sale_name}</Typography>
            <Chip size={"small"} label={item.total_order} color="info" style={styles.priceChip} />
            <Chip
              size={"small"}
              label={fNumber(item.total_revenue)}
              color="success"
              style={styles.priceChip}
            />
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default MTopSale;

const styles: TStyles<"priceChip"> = {
  priceChip: { fontSize: "0.7rem" },
};
