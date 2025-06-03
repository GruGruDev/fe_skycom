import { OrderLineItemDTO } from "types/Order";
import { TSheetDetail } from "types/Sheet";
import { TInventory } from "types/Warehouse";
import { forOf } from "utils/forOf";
import { calcInventoryByWarehouseDefault } from "./calcInventoryByWarehouseDefault";
import { handleUniqVariant } from "./handleUniqVariant";
import { matchLineItemKeys } from "./matchLineItemKeys";

export const handleCheckInventory = ({
  lineItems = [],
  warehouseIds = [],
  listInventory,
  listInventoryInOrder,
}: {
  lineItems?: Partial<OrderLineItemDTO>[];
  listInventoryInOrder?: {
    [key: string]: TInventory[];
  };
  warehouseIds?: string[];
  listInventory?: TSheetDetail[];
}) => {
  let isDenyConfirm = false;

  let totalQuantity: {
    [key: string]: Partial<OrderLineItemDTO>;
  } = {};

  const variants = handleUniqVariant({
    line_items: matchLineItemKeys(lineItems),
    isUniqCombo: true,
  });

  forOf(variants, (item) => {
    const { id = "", quantity = 0 } = item;

    const inventoryAvailabel = calcInventoryByWarehouseDefault({
      warehouseIds,
      variantId: id,
      listInventory,
      listInventoryInOrder,
    });

    totalQuantity[id] = item;
    if (inventoryAvailabel < quantity) {
      isDenyConfirm = true;
    }
  });

  return {
    isDenyConfirm,
    totalQuantity,
  };
};
