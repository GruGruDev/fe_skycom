import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { productApi } from "apis/product";
import MTableWrapper from "components/Table/MTableWrapper";
import { BUTTON } from "constants/button";
import { LABEL } from "constants/label";
import { PRODUCT_SORT_OPTIONS } from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import { MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TAttribute } from "types/Attribute";
import { TParams } from "types/Param";
import { TProduct } from "types/Product";
import { TStyles } from "types/Styles";
import { fDateTime } from "utils/date";
import FormProductModal from "../components/FormProductModal";
import { IMAGE_TYPE, TImage } from "types/Media";
import FilterComponent from "../components/FilterComponent";
import reduce from "lodash/reduce";
import { TSelectOption } from "types/SelectOption";
import { formatOptionSelect } from "utils/option";
import AddButton from "components/Buttons/AddButton";
import DrawerFilterContent from "../components/DrawerFilterContent";
import HandlerImage from "components/Images/HandlerImage";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "..";

const MSimpleProduct = () => {
  const { category, supplier } = useAppSelector(getDraftSafeSelector("product")).attributes;
  const { tabMSimpleProduct } = useContext(ProductContext);
  const { params, setParams } = tabMSimpleProduct || {};
  const { newCancelToken } = useCancelToken([params]);

  const [open, setOpen] = useState(false);

  const getProducts = useCallback(
    async (params?: TParams) => {
      const result = await productApi.get<TProduct>({
        params: { ...params, cancelToken: newCancelToken() },
      });

      return result;
    },
    [newCancelToken],
  );

  const categoryOptions = useMemo(() => {
    return reduce(category, (prev: TSelectOption[], cur) => [...prev, formatOptionSelect(cur)], []);
  }, [category]);
  const supplierOptions = useMemo(() => {
    return reduce(supplier, (prev: TSelectOption[], cur) => [...prev, formatOptionSelect(cur)], []);
  }, [supplier]);

  return (
    <MTableWrapper
      searchPlaceholder={PRODUCT_LABEL.search_product}
      setParams={setParams}
      params={params}
      itemComponent={(item, index) => (
        <Box key={index}>
          <MProductItem
            product={item}
            category={category}
            supplier={supplier}
            onRefresh={() => setParams?.({ ...params, page: 1 })}
          />
        </Box>
      )}
      onGetData={getProducts}
      onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
      filterComponent={
        <FilterComponent
          category={categoryOptions}
          supplier={supplierOptions}
          isFilterCategory
          isFilterSupplier
          isFilterActive
          setParams={setParams}
          params={params}
        />
      }
      rightHeaderChildren={
        <>
          <FormProductModal
            onRefresh={() => setParams?.({ ...params, page: 1 })}
            open={open}
            onClose={() => setOpen(false)}
          />
          <AddButton onClick={() => setOpen(true)} label={BUTTON.ADD} />
        </>
      }
      orderingOptions={PRODUCT_SORT_OPTIONS}
      itemHeight={107}
      filterDrawer={(params, setParams) => (
        <DrawerFilterContent
          categoryOptions={categoryOptions}
          supplierOptions={supplierOptions}
          params={params}
          setParams={setParams}
        />
      )}
    />
  );
};

export default MSimpleProduct;

export const MProductItem = ({
  product,
  category,
  supplier,
  onRefresh,
}: {
  product: Partial<TProduct>;
  category: TAttribute[];
  supplier: TAttribute[];
  onRefresh?: () => void;
}) => {
  const navigate = useNavigate();
  const [item, setItem] = useState(product);
  const categoryName = category.find((c) => c.id === item.category)?.name;
  const supplierName = supplier.find((c) => c.id === item.supplier)?.name;

  // const [params, setParams] = useState<TParams>({ limit: 15, page: 1 });

  const [open, setOpen] = useState(false);
  // const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  // const getData = useCallback(
  //   async (params?: TParams) => {
  //     const result = await productApi.get<TVariant>({
  //       params: { ...params, product: item.id },
  //       endpoint: "variants/",
  //     });
  //     return result;
  //   },
  //   [item.id],
  // );

  const onAddImage = (image: TImage) => {
    setItem((prev) => ({ ...prev, images: [image, ...(prev.images || [])] }));
  };

  const handleGetListVariant = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    navigate(`/product/list/simple-variant?product=${product.id}`);
  };

  useEffect(() => {
    setItem(product);
  }, [product]);

  return (
    <Paper elevation={1} sx={{ p: 1, position: "relative" }}>
      <FormProductModal
        onClose={() => setOpen(false)}
        onRefresh={onRefresh}
        open={open}
        row={item}
      />
      {/* list variant drawer */}
      {/* <Drawer
        anchor={"right"}
        open={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        sx={{ zIndex: ZINDEX_SYSTEM.drawer }}
      >
        <Button
          onClick={() => setIsOpenDrawer(false)}
          sx={{ width: "fit-content" }}
          color="inherit"
        >
          {BUTTON.CLOSE}
        </Button>
        <TitleDrawer textAlign={"center"}>{PRODUCT_LABEL.list_variant}</TitleDrawer>
        <Box p={2}>
          <MTableWrapper
            containerSx={{ width: 375 }}
            setParams={setParams}
            params={params}
            itemComponent={(item) => <MVariantItem variant={item} />}
            onGetData={getData}
            onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
            itemHeight={156}
          />
        </Box>
      </Drawer> */}
      {/* ---------- */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        onClick={() => setOpen(true)}
        width={"100%"}
      >
        <Box>
          <HandlerImage
            value={product.images}
            height={"5rem"}
            width={"5rem"}
            preview
            onAddImage={onAddImage}
            params={{ type: IMAGE_TYPE.PD, product: product.id }}
          />
        </Box>
        <Stack spacing={1}>
          <Stack direction={"row"} alignItems={"center"} spacing={1} width={"100%"}>
            <Typography fontSize={"0.825rem"} color={product.is_active ? "primary" : "error"}>
              {product.name}
            </Typography>
            <Button
              variant="contained"
              sx={{ maxHeight: 25, position: "absolute", top: 3, right: 3 }}
              onClick={handleGetListVariant}
            >
              {`${LABEL.SEE} ${product.total_variants || 0} ${PRODUCT_LABEL.variant}`}
            </Button>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Typography fontSize={"0.7rem"}>{product.SKU_code}</Typography>
            {categoryName && <Divider orientation="vertical" variant="middle" flexItem />}
            {categoryName && <Typography fontSize={"0.7rem"}>{categoryName}</Typography>}
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Chip
              size={"small"}
              label={`${product.total_inventory || 0} ${PRODUCT_LABEL.total_inventory}`}
              color="default"
              style={styles.priceChip}
            />
            {supplierName && (
              <Chip size={"small"} label={supplierName} color="info" style={styles.priceChip} />
            )}
            <Chip
              size={"small"}
              label={fDateTime(product.modified)}
              color="default"
              style={styles.priceChip}
            />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const styles: TStyles<"priceChip"> = {
  priceChip: { fontSize: "0.7rem" },
};
