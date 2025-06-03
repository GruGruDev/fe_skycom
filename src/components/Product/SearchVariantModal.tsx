import SearchIcon from "@mui/icons-material/Search";
import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { productApi } from "apis/product";
import { SearchField, SearchFieldProps } from "components/Fields";
import { NoDataPanel } from "components/NoDataPanel";
import { FormPopup } from "components/Popups";
import { useCancelToken } from "hooks/useCancelToken";
import find from "lodash/find";
import map from "lodash/map";
import { memo, useCallback, useEffect, useState } from "react";
import { FieldError } from "react-hook-form";
import { OrderLineItemDTO } from "types/Order";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TStyles } from "types/Styles";
import { VariantItem, VariantItemColumnName } from ".";
import VariantListHeaderCell from "./VariantListHeaderCell";
import { PRODUCT_LABEL } from "constants/product/label";
import { LABEL } from "constants/label";

interface Props extends Omit<SearchFieldProps, "error"> {
  setSelectedProduct: (products: Partial<OrderLineItemDTO>[]) => void;
  params?: any;
  checkedProductDefault?: Partial<OrderLineItemDTO>[];
  error?: FieldError;
  containerSx?: SxProps<Theme>;
  hiddenColumns?: VariantItemColumnName[];
}

export const SearchVariantModal = memo((props: Props) => {
  const {
    setSelectedProduct,
    params,
    checkedProductDefault = [],
    error,
    containerSx,
    hiddenColumns = ["combo", "cross_sale", "quantity", "total"],
  } = props;

  const [searchProductText, setSearchProductText] = useState("");

  const [products, setProducts] = useState<{ data: Partial<OrderLineItemDTO>[]; loading: boolean }>(
    {
      data: [],
      loading: false,
    },
  );

  // kết hợp giữa danh sách product với danh sách product đã được checked
  const [syncedProducts, setSyncedProducts] = useState<Partial<OrderLineItemDTO>[]>([]);

  const [checkedProduct, setCheckedProduct] = useState<Partial<OrderLineItemDTO>[]>([]);
  const { newCancelToken } = useCancelToken([searchProductText]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const fillSelectedProductToModal = useCallback(() => {
    let productClone = [...products.data];
    productClone = map(productClone, (curr) => {
      const selectedProduct = find(checkedProduct, (item) => item.id === curr.id);
      return { ...curr, selected: !!selectedProduct };
    });
    setSyncedProducts(productClone);
  }, [products.data, checkedProduct]);

  const getProducts = useCallback(async () => {
    if (open) {
      setProducts((prev) => ({ ...prev, loading: true }));

      const result = await productApi.get<OrderLineItemDTO>({
        params: {
          limit: 200,
          page: 1,
          search: searchProductText,
          ...params,
          is_active: "true",
          cancelToken: newCancelToken(),
        },
        endpoint: "variants/",
      });
      if (result.data) {
        setProducts({ data: result.data.results, loading: false });
        return;
      }

      if (result.error.name === CANCEL_REQUEST) {
        return;
      }

      setProducts((prev) => ({ ...prev, loading: false }));
    }
  }, [newCancelToken, params, searchProductText, open]);

  const handleOpen = useCallback(() => {
    if (searchProductText) {
      setCheckedProduct(checkedProductDefault);
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProductText]);

  const handleCloseModal = useCallback(() => {
    if (!open) {
      setCheckedProduct([]);
      setSyncedProducts([]);
      setSearchProductText("");
    }
  }, [open, setSearchProductText]);

  const handleChangeSearchText = (value: string) => {
    setSearchProductText(value);
    setOpen(true);
  };

  const handleAddVariants = async ({
    index = -1,
    product,
  }: {
    product: Partial<OrderLineItemDTO>;
    index?: number;
  }) => {
    const { quantity = 1 } = product;
    //tìm product trong danh sách đã checked
    const checkedProductClone = [...checkedProduct];
    const syncedProductClone = [...syncedProducts];
    const checkNewProductIdx = checkedProductClone.findIndex((item) => item.id === product.id);
    if (checkNewProductIdx >= 0) {
      //nếu có thì remove
      checkedProductClone.splice(checkNewProductIdx, 1);
      //update lại trong danh sách product
      syncedProductClone[index] = { ...product, selected: false };
    } else {
      //nếu chưa thì thêm vào checked product
      checkedProductClone.push({
        ...product,
        quantity,
        price_variant_logs: product.sale_price,
        price_total_input: product.sale_price,
      });
      syncedProductClone[index] = {
        ...product,
        selected: true,
        price_variant_logs: product.sale_price,
        price_total_input: product.sale_price,
      };
    }
    setCheckedProduct(checkedProductClone);
    setSyncedProducts(syncedProductClone);
  };

  const handleSubmitSelectedProduct = () => {
    handleClose();

    setSelectedProduct(checkedProduct);
  };

  useEffect(() => {
    fillSelectedProductToModal();
  }, [fillSelectedProductToModal]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    handleOpen();
  }, [handleOpen]);

  useEffect(() => {
    handleCloseModal();
  }, [handleCloseModal]);

  return (
    <Box sx={containerSx}>
      <SearchField
        {...props}
        onSearch={handleChangeSearchText}
        fullWidth
        defaultValue={searchProductText}
        renderIcon={<SearchIcon />}
        placeholder={PRODUCT_LABEL.enter_name_and_sku}
        error={!!error}
        helperText={error?.message}
        autoFocus
      />
      <FormPopup
        title={PRODUCT_LABEL.select_product}
        buttonText="Xong"
        maxWidth="md"
        open={open}
        handleSubmitPopup={handleSubmitSelectedProduct}
        handleClose={handleClose}
        funcContentRender={() => (
          <>
            <SearchField
              isDebounce
              onSearch={setSearchProductText}
              defaultValue={searchProductText}
              fullWidth
              renderIcon={<></>}
              placeholder={PRODUCT_LABEL.enter_name_and_sku}
              autoFocus
              loading={products.loading}
              adornmentPosition="end"
              style={styles.searchField}
            />
            <VariantListHeaderCell hiddenColumns={hiddenColumns} />
            {syncedProducts.length === 0 ? (
              <NoDataPanel
                message={LABEL.NO_DATA}
                wrapImageSx={{ height: "120px" }}
                containerSx={{ mt: 2 }}
                showImage
              />
            ) : (
              <List>
                {syncedProducts.map((item, idx) => {
                  return (
                    <VariantItem
                      value={item}
                      key={item.id}
                      onAddVariants={handleAddVariants}
                      index={idx}
                      hiddenColumns={hiddenColumns}
                      imageHeight={92}
                    />
                  );
                })}
              </List>
            )}
          </>
        )}
      />
    </Box>
  );
});

const styles: TStyles<"paper" | "searchField"> = {
  paper: { height: 50, marginBottom: 8 },
  searchField: { marginBottom: 16 },
};
