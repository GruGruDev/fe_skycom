import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { VariantItem, VariantItemProps } from "components/Product";
import { ORDER_LABEL } from "constants/order/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useEffect, useMemo } from "react";
import { FieldErrors } from "react-hook-form";
import { OrderLineItemDTO } from "types/Order";
import { TSheetDetail } from "types/Sheet";
import { TInventory } from "types/Warehouse";
import { findOption } from "utils/option";
import { calcInventoryByWarehouseDefault } from "utils/order/calcInventoryByWarehouseDefault";
import Inventory, { InventoryProps } from "./Inventory";

export interface VariantProps
  extends VariantItemProps,
    Omit<InventoryProps, "error" | "value" | "quantity"> {
  value: Partial<OrderLineItemDTO>;
  onUpdate?: (product: Partial<OrderLineItemDTO> & { index: number }) => void;
  index?: number;
  error?: FieldErrors<OrderLineItemDTO>;
  isShowInventoryActual?: boolean;
  isShowInventoryAvailable?: boolean;
  imageHeight?: number;
  isShowInventory?: boolean;
  listInventory?: TSheetDetail[];
  selectedWarehouses?: string[];
  listInventoryInOrder?: {
    [key: string]: TInventory[];
  };
  //
}

export const Variant = (props: VariantProps) => {
  const {
    value = {},
    onChangeInventory,
    onUpdate,
    index = -1,
    error,
    isShowInventory,
    listInventory,
    listInventoryInOrder,
    isShowInventoryActual,
    isShowInventoryAvailable,
    selectedWarehouses,
  } = props;
  const { warehouseIds } = useAppSelector(getDraftSafeSelector("warehouses"));
  const inventory = findOption(listInventory, value.id);

  const handleChangeQuantity = (
    product: Partial<OrderLineItemDTO> & {
      index: number;
    },
  ) => {
    if (onUpdate) {
      const { quantity = 0, price_variant_logs = 0, sale_price = 0 } = product;
      const totalPrice = (price_variant_logs || sale_price) * quantity;

      onUpdate({ ...product, price_total: totalPrice, index });
    }
  };

  const handleChangeTotalPriceInput = (
    product: Partial<OrderLineItemDTO> & {
      index: number;
    },
  ) => {
    if (onUpdate) {
      onUpdate({ ...product, index });
    }
  };

  const batchesOfWarehouseDefault = useMemo(
    () =>
      inventory?.batches?.filter((item) =>
        selectedWarehouses?.includes(item.inventories?.[0]?.warehouse_id || ""),
      ) || [],
    [inventory?.batches, selectedWarehouses],
  );

  const inventoryByWarehouseDefault = calcInventoryByWarehouseDefault({
    warehouseIds,
    variantId: value.id,
    listInventory,
    listInventoryInOrder,
  });

  useEffect(() => {
    if (onChangeInventory) {
      const matchBatch = batchesOfWarehouseDefault.find((item) => (item.total_inventory || 0) > 0);
      if (matchBatch) {
        const { batch_id = "", inventories } = matchBatch;
        onChangeInventory({ batch: batch_id, warehouse: inventories?.[0]?.warehouse_id || "" });
      }
    }
    // khi thay đổi kho
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchesOfWarehouseDefault.length, selectedWarehouses?.[0]]);

  const { quantity = 1 } = value;

  return (
    <Paper sx={{ mt: 1, p: 1 }} elevation={1}>
      <VariantItem
        {...props}
        key={index}
        index={index}
        onUpdateQuantity={onUpdate ? handleChangeQuantity : undefined}
        onUpdateTotalPrice={onUpdate ? handleChangeTotalPriceInput : undefined}
      />

      {/* tồn kho */}
      <Stack direction="row">
        {isShowInventoryActual && (
          <Typography component="li" mr={3} fontSize={"0.82rem"}>
            {`${ORDER_LABEL.actual_inventory}: ${inventory?.total_inventory || 0}`}
          </Typography>
        )}

        {isShowInventoryAvailable && (
          <Typography
            component="li"
            mr={3}
            fontSize={"0.82rem"}
            color={inventoryByWarehouseDefault < quantity ? "error.main" : "unset"}
          >
            {`${ORDER_LABEL.available_inventory}: `}
            {inventoryByWarehouseDefault || 0}
            {/* {inventoryAvailableOfWarehouseDefault || value.inventoryAvailabel || 0} */}
          </Typography>
        )}
      </Stack>
      {/* danh sách lô */}
      {isShowInventory ? (
        <Inventory
          error={error?.batch || error?.warehouse}
          inventories={batchesOfWarehouseDefault}
          quantity={quantity}
          onChangeInventory={onChangeInventory}
          value={value.batch}
        />
      ) : null}
    </Paper>
  );
};
