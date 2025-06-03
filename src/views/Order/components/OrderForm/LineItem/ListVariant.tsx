import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import { warehouseApi } from "apis/warehouse";
import { NoDataPanel } from "components/NoDataPanel";
import VariantListHeaderCell from "components/Product/VariantListHeaderCell";
import { LABEL } from "constants/label";
import differenceBy from "lodash/differenceBy";
import React, { useCallback, useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { OrderLineItemDTO } from "types/Order";
import { TSheetDetail } from "types/Sheet";
import { TInventory } from "types/Warehouse";
import { forOf } from "utils/forOf";
import { handleUniqVariant } from "utils/order/handleUniqVariant";
import { matchLineItemKeys } from "utils/order/matchLineItemKeys";
import { Variant, VariantProps } from "./Variant";
import { TStyles } from "types/Styles";
import useResponsive from "hooks/useResponsive";
import map from "lodash/map";
import difference from "lodash/difference";
import { MVariant } from "./MVariant";
import { useCancelToken } from "hooks/useCancelToken";

export interface ListVariantProps extends Omit<VariantProps, "value" | "onChangeInventory"> {
  setListVariants: (products: any[]) => void;
  onChangeVariantInventory: UseFormSetValue<any>;
  inventory?: boolean;
  selectedVariants?: Partial<OrderLineItemDTO>[];
  title?: string;
  titleStyle?: React.CSSProperties;
  error?: any;
  style?: React.CSSProperties;
  listProductSx?: SxProps<Theme>;
  isUpdate?: boolean;
  isDelete?: boolean;
  setListInventoryInOrder?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: TInventory[];
    }>
  >;
  setListInventory?: React.Dispatch<React.SetStateAction<TSheetDetail[]>>;
}

export const ListVariant = (props: ListVariantProps) => {
  const {
    selectedVariants = [],
    setListVariants,
    onChangeVariantInventory,
    title,
    titleStyle,
    error,
    style,
    listProductSx,
    isDelete = true,
    isUpdate = true,
    hiddenColumns = [],
    isShowInventoryAvailable,
    isShowInventoryActual,
    selectedWarehouses,
    isShowInventory,
    setListInventory,
    setListInventoryInOrder,
    listInventory,
    listInventoryInOrder,
  } = props;

  const [uniqueVariantCache, setUniqueVariantCache] = useState<Partial<OrderLineItemDTO>[]>([]);
  const [cacheVariantIds, setCacheVariantIds] = useState<(string | undefined)[]>([]);
  const [loading, setLoading] = useState(false);
  const isDesktop = useResponsive("up", "sm");
  const { newCancelToken } = useCancelToken([selectedWarehouses, selectedVariants]);

  const handleUpdateProduct = useCallback(
    (product: Partial<OrderLineItemDTO> & { index: number }) => {
      const { index } = product;
      const selectedProductClone = [...selectedVariants];
      selectedProductClone[index] = product;

      setListVariants(selectedProductClone);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedVariants],
  );

  const handleDeleteVariant = (index: number) => {
    const selectedProductClone = [...selectedVariants];
    selectedProductClone.splice(index, 1);

    setListVariants(selectedProductClone);
  };

  const getInventoryByWarehouse = useCallback(async () => {
    if (selectedVariants.length && selectedWarehouses?.length) {
      const variants = handleUniqVariant({ line_items: matchLineItemKeys(selectedVariants) });
      const variantIds = map(variants, "id");
      if (difference(variantIds, cacheVariantIds).length === 0) {
        return;
      }
      setCacheVariantIds(variantIds);
      // const variantIds = variants.map((item) => item.id);

      setLoading(true);
      const res = await warehouseApi.get<TSheetDetail>({
        params: {
          limit: 100,
          page: 1,
          warehouse: selectedWarehouses,
          variant: variantIds,
          cancelToken: newCancelToken(),
        },
        endpoint: "inventory-with-variant/",
      });
      setLoading(false);
      if (res.data) {
        const { results = [] } = res.data;
        setListInventory?.(results);
      }
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWarehouses, selectedVariants]);

  // lấy danh sách lô
  const getInventoryInOrder = async (inventoryCache?: TInventory[], product_variant?: string) => {
    if (inventoryCache) {
      return inventoryCache;
    }
    if (product_variant) {
      setLoading(true);
      const res = await warehouseApi.get<TInventory>({
        params: { limit: 100, page: 1, product_variant },
        endpoint: "inventory-available/",
      });
      setLoading(false);
      if (res.data) {
        return res.data.results;
      }
      return [];
    }
    return [];
  };

  const setInventoryInOrder = useCallback(async () => {
    if (isShowInventoryAvailable) {
      const variants = handleUniqVariant({ line_items: matchLineItemKeys(selectedVariants) });
      if (
        !differenceBy(variants, uniqueVariantCache, "id").length ||
        variants.length < uniqueVariantCache.length
      ) {
        return;
      }
      setUniqueVariantCache(variants);

      const listInventoryInOrder: { [key: string]: TInventory[] } = {};

      const listInventoryAvailabel = await Promise.all(
        variants.map((item) => {
          const variantCacheIndex = uniqueVariantCache.findIndex(
            (cacheItem) => cacheItem.id === item.id,
          );
          if (variantCacheIndex >= 0) {
            return getInventoryInOrder(
              uniqueVariantCache[variantCacheIndex].inventoryCache,
              item.id,
            );
          }
          return getInventoryInOrder(undefined, item.id);
        }),
      );

      // thứ tự id của variants đúng với thứ tự trong listInventoryInOrder
      forOf(variants, (item, index) => {
        if (item.id) {
          listInventoryInOrder[item.id] = listInventoryAvailabel[index].length
            ? listInventoryAvailabel[index]
            : listInventoryInOrder[item.id];
        }
      });
      setListInventoryInOrder?.(listInventoryInOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariants, isShowInventoryAvailable, uniqueVariantCache]);

  useEffect(() => {
    setInventoryInOrder();
  }, [setInventoryInOrder]);

  useEffect(() => {
    getInventoryByWarehouse();
  }, [getInventoryByWarehouse]);

  return (
    <Box style={style}>
      <FormLabel style={{ ...styles.title, ...titleStyle }} id="list-product" error={!!error}>
        {title}
      </FormLabel>

      {/* header list */}
      {isDesktop && selectedVariants.length > 0 && (
        <VariantListHeaderCell
          hiddenColumns={hiddenColumns}
          isDelete={isDelete}
          loading={loading}
        />
      )}
      {/* ----------------------------- */}

      <Box sx={listProductSx}>
        {selectedVariants.length <= 0 ? (
          <NoDataPanel message={LABEL.NO_DATA} wrapImageSx={{ height: "120px" }} showImage />
        ) : (
          <Stack>
            {selectedVariants.map((item, index) => {
              return isDesktop ? (
                <Variant
                  {...props}
                  onDelete={isDelete ? handleDeleteVariant : undefined}
                  onUpdate={isUpdate ? handleUpdateProduct : undefined}
                  key={index}
                  value={item}
                  index={index}
                  error={error?.[index] as any}
                  isCheckCrossSale
                  listInventoryInOrder={listInventoryInOrder}
                  listInventory={listInventory || []}
                  isShowInventory={isShowInventory}
                  isShowInventoryActual={isShowInventoryActual}
                  isShowInventoryAvailable={isShowInventoryAvailable}
                  onChangeInventory={
                    onChangeVariantInventory
                      ? (inventory) =>
                          onChangeVariantInventory(`line_items.${index}`, {
                            ...item,
                            ...inventory,
                            index,
                          })
                      : undefined
                  }
                />
              ) : (
                <MVariant
                  {...props}
                  key={index}
                  value={item}
                  index={index}
                  error={error?.[index] as any}
                  isCheckCrossSale
                />
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

const styles: TStyles<"title"> = { title: { marginBottom: 8, marginTop: 16 } };
