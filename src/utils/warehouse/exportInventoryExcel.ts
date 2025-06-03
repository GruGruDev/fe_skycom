import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { forOf } from "utils/forOf";
import { fNumber } from "utils/number";
import { TProductInventory } from "views/WarehouseInventory/components/ProductInventoryTable";

export const formatDataToExport = (data: Partial<TProductInventory>[]) => {
  let results: { [key: string]: any }[] = [];
  forOf(data, (product) => {
    forOf(product.variants || [], (variant) => {
      forOf(variant.batches || [], (batch) => {
        const itemClone = {
          [INVENTORY_LOG_LABEL.warehouse_name]: batch.warehouse_name,
          //product
          [INVENTORY_LOG_LABEL.product_name]: product.product_name,
          [INVENTORY_LOG_LABEL.category_name]: product.category_name,
          [`${INVENTORY_LOG_LABEL.product}-${INVENTORY_LOG_LABEL.product_first_inventory}`]:
            product.product_first_inventory,
          [`${INVENTORY_LOG_LABEL.product}-${INVENTORY_LOG_LABEL.product_c_import}`]:
            product.product_c_import,
          [`${INVENTORY_LOG_LABEL.product}-${INVENTORY_LOG_LABEL.product_c_export}`]:
            product.product_c_export,
          [`${INVENTORY_LOG_LABEL.product}-${INVENTORY_LOG_LABEL.product_last_inventory}`]:
            product.product_last_inventory,
          //variant
          [INVENTORY_LOG_LABEL.variant_name]: variant.variant_name,
          [INVENTORY_LOG_LABEL.variant_SKU_code]: variant.variant_SKU_code,
          [`${INVENTORY_LOG_LABEL.variant}-${INVENTORY_LOG_LABEL.variant_first_inventory}`]:
            variant.variant_first_inventory,
          [`${INVENTORY_LOG_LABEL.variant}-${INVENTORY_LOG_LABEL.variant_c_import}`]:
            variant.variant_c_import,
          [`${INVENTORY_LOG_LABEL.variant}-${INVENTORY_LOG_LABEL.variant_c_export}`]:
            variant.variant_c_export,
          [`${INVENTORY_LOG_LABEL.variant}-${INVENTORY_LOG_LABEL.variant_last_inventory}`]:
            variant.variant_last_inventory,
          [`${INVENTORY_LOG_LABEL.sale_price}-${INVENTORY_LOG_LABEL.sale_price}`]: fNumber(
            variant.sale_price || 0,
          ),
          // batch
          [INVENTORY_LOG_LABEL.batch_name]: batch.batch_name,
          [`${INVENTORY_LOG_LABEL.batch}-${INVENTORY_LOG_LABEL.first_inventory}`]:
            batch.first_inventory,
          [`${INVENTORY_LOG_LABEL.batch}-${INVENTORY_LOG_LABEL.c_import}`]: batch.c_import,
          [`${INVENTORY_LOG_LABEL.batch}-${INVENTORY_LOG_LABEL.c_export}`]: batch.c_export,
          [`${INVENTORY_LOG_LABEL.batch}-${INVENTORY_LOG_LABEL.last_inventory}`]:
            batch.last_inventory,
        };
        results = [...results, itemClone];
      });
    });
  });

  return results;
};
