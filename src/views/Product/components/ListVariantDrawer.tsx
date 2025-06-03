import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { productApi } from "apis/product";
import MTableWrapper from "components/Table/MTableWrapper";
import { TitleDrawer } from "components/Texts";
import { BUTTON } from "constants/button";
import { PRODUCT_LABEL } from "constants/product/label";
import { useCallback, useState } from "react";
import { TParams } from "types/Param";
import { TProduct, TVariant } from "types/Product";
import { MVariantItem } from "../tabs/MSimpleVariant";
import { ZINDEX_SYSTEM } from "constants/index";

type Props = {
  product: TProduct;
};

const ListVariantDrawer = (props: Props) => {
  const { product } = props;
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<TParams>({ limit: 15, page: 1, product: product.id });

  const getData = useCallback(async (params?: TParams) => {
    const result = await productApi.get<TVariant>({ params, endpoint: "variants/" });
    return result;
  }, []);

  return (
    <Box position={"relative"} width={"fit-content"}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        {product.name}
      </Button>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: ZINDEX_SYSTEM.dialog, ".MuiPaper-root": { maxWidth: 600, width: "100%" } }}
      >
        <Button onClick={() => setOpen(false)} sx={{ width: "fit-content" }} color="inherit">
          {BUTTON.CLOSE}
        </Button>
        <TitleDrawer textAlign={"center"}>{PRODUCT_LABEL.list_variant}</TitleDrawer>

        <Box p={[1, 2, 3, 4, 5]}>
          <MTableWrapper
            containerSx={{ width: "100%" }}
            setParams={setParams}
            params={params}
            itemComponent={(item) => <MVariantItem variant={item} />}
            onGetData={getData}
            onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
            itemHeight={156}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default ListVariantDrawer;
