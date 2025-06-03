import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { TReportProduct } from "./TopProductTable";
import { fNumber } from "utils/number";
import { TStyles } from "types/Styles";
import { NoDataPanel } from "components/NoDataPanel";
import { getTopHighlightColor } from "utils/color";
import HandlerImage from "components/Images/HandlerImage";

type Props = {
  listProduct: TReportProduct[];
  loading?: boolean;
};

const MTopProduct = ({ listProduct = [], loading = false }: Props) => {
  return listProduct.length == 0 ? (
    <NoDataPanel containerSx={{ p: 2 }} loading={loading} showImage />
  ) : (
    <Grid container gap={0.5} px={2}>
      {listProduct.map((item, index) => {
        return (
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
              <Box>
                <HandlerImage value={item.images} height={"4rem"} width={"4rem"} preview onlyOne />
              </Box>
              <Box>
                <Typography fontSize={"0.825rem"}>{item.variant_name}</Typography>
                <Typography fontSize={"0.7rem"}>{item.SKU_code}</Typography>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Chip
                    size={"small"}
                    label={item.total_quantity}
                    color="info"
                    style={styles.priceChip}
                  />
                  <Chip
                    size={"small"}
                    label={fNumber(item.total_price)}
                    color="success"
                    style={styles.priceChip}
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MTopProduct;

const styles: TStyles<"priceChip"> = {
  priceChip: { fontSize: "0.7rem" },
};
