import styled from "@emotion/styled";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TStyles } from "types/Styles";
import { VariantItemColumnName } from "./VariantItem";
import { PRODUCT_LABEL } from "constants/product/label";
import { VARIANT_COLUMN_GRID } from "constants/product";

type Props = {
  loading?: boolean;
  hiddenColumns: VariantItemColumnName[];
  isDelete?: boolean;
};

const VariantListHeaderCell = (props: Props) => {
  const { loading, hiddenColumns, isDelete } = props;
  return (
    <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center" }}>
      {loading && <LinearProgress />}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ color: "#637381" }}
        spacing={1}
      >
        {!hiddenColumns?.includes("product") && (
          <Grid
            item
            xs={
              VARIANT_COLUMN_GRID.name +
              (hiddenColumns?.includes("price") ? VARIANT_COLUMN_GRID.price : 0) +
              (hiddenColumns?.includes("neo_price") ? VARIANT_COLUMN_GRID.neo_price : 0) +
              (hiddenColumns?.includes("quantity") ? VARIANT_COLUMN_GRID.quantity : 0) +
              (hiddenColumns?.includes("total") ? VARIANT_COLUMN_GRID.total : 0)
            }
          >
            <TitleHeaderProductList style={styles.headerTitle}>
              {PRODUCT_LABEL.product}
            </TitleHeaderProductList>
          </Grid>
        )}
        {!hiddenColumns?.includes("neo_price") && (
          <Grid item xs={VARIANT_COLUMN_GRID.neo_price}>
            <TitleHeaderProductList>{PRODUCT_LABEL.neo_price}</TitleHeaderProductList>
          </Grid>
        )}
        {!hiddenColumns?.includes("price") && (
          <Grid item xs={VARIANT_COLUMN_GRID.price}>
            <TitleHeaderProductList>{PRODUCT_LABEL.sale_price}</TitleHeaderProductList>
          </Grid>
        )}
        {!hiddenColumns?.includes("quantity") && (
          <Grid item xs={VARIANT_COLUMN_GRID.quantity}>
            <TitleHeaderProductList>{PRODUCT_LABEL.quantity}</TitleHeaderProductList>
          </Grid>
        )}
      </Grid>
      {isDelete && <Box width={48} />}
    </Paper>
  );
};

export default VariantListHeaderCell;

const TitleHeaderProductList = styled(Typography)(() => ({
  lineHeight: "1.5rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  textAlign: "center",
}));

const styles: TStyles<"headerTitle"> = {
  headerTitle: { textAlign: "start" },
};
