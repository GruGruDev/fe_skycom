import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { TInventory } from "types/Warehouse";
import { redirectVariantUrl } from "utils/product/redirectUrl";

const InventoryItem = (inventory: Partial<TInventory>) => {
  const { product_variant_batch, quantity } = inventory;
  return (
    <Stack padding={1} spacing={1} width="100%">
      <Link
        underline="hover"
        variant="subtitle2"
        color="primary.main"
        sx={{ cursor: "pointer", fontSize: "0.82rem" }}
        href={redirectVariantUrl(product_variant_batch?.product_variant?.id)}
      >
        {product_variant_batch?.product_variant?.name}
      </Link>
      <Typography fontSize={"0.82rem"} className="sku-label">
        {`${INVENTORY_LOG_LABEL.SKU}: ${product_variant_batch?.product_variant?.SKU_code}`}
      </Typography>
      <Typography fontSize={"0.82rem"} fontWeight="bold" className="inventory-label">
        {`${INVENTORY_LOG_LABEL.product_variant_batch}: ${product_variant_batch?.name} - ${INVENTORY_LOG_LABEL.inventory}: ${quantity}`}
      </Typography>
    </Stack>
  );
};

export default InventoryItem;
