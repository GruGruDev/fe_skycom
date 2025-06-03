import Grid from "@mui/material/Grid";
import Category from "./Category";
import Supplier from "./Supplier";
import Tag from "./Tag";

const ProductAttributes = () => {
  return (
    <Grid container spacing={1} sx={{ px: { xs: 1, sm: 5, md: 0, xl: 15 } }} py={4}>
      <Grid xs={12} md={6} item>
        <Category />
      </Grid>
      <Grid xs={12} md={6} item>
        <Supplier />
      </Grid>
      <Grid xs={12} md={6} item>
        <Tag />
      </Grid>
    </Grid>
  );
};

export default ProductAttributes;
