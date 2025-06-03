import reduce from "lodash/reduce";
import { TSheetDetail } from "types/Sheet";
import { TInventory } from "types/Warehouse";
import { findOption } from "utils/option";

export const calcInventoryByWarehouseDefault = ({
  listInventoryInOrder,
  warehouseIds,
  listInventory,
  variantId = "",
}: {
  listInventoryInOrder?: {
    [key: string]: TInventory[];
  };
  warehouseIds: string[];
  listInventory?: TSheetDetail[];
  variantId?: string;
}) => {
  const inventory = findOption(listInventory, variantId);
  const batchesOfWarehouseDefault = inventory?.batches?.filter((item) =>
    warehouseIds.includes(item.inventories?.[0]?.warehouse_id || ""),
  );

  const inventoryOfWarehouseDefault = reduce(
    batchesOfWarehouseDefault,
    (prev: number, item) => {
      return (prev += parseInt((item.total_inventory || 0).toString()));
    },
    0,
  );

  const inventoryConfirm = reduce(
    listInventoryInOrder?.[variantId || ""],
    (prevSum: number, cur) => {
      return (prevSum += parseInt((cur.quantity_confirm || 0).toString()));
    },
    0,
  );

  const inventoryAvailableOfWarehouseDefault = inventoryOfWarehouseDefault - inventoryConfirm;
  return inventoryAvailableOfWarehouseDefault;
};
