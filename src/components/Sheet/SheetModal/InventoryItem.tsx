import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HandlerImage from "components/Images/HandlerImage";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { TVariantDetail } from "types/Product";
import { TStyles } from "types/Styles";
import { formatFloatToString } from "utils/number";
import { redirectVariantUrl } from "utils/product/redirectUrl";

const InventoryItem = (variant: Partial<TVariantDetail>) => {
  const { name = "", id = "", SKU_code = "", total_inventory, images } = variant;

  return (
    <Stack style={styles.wrapper} alignItems="center" width={"100%"}>
      <HandlerImage width={72} height={72} value={images} onlyOne />
      <Stack padding={2}>
        <Link
          underline="hover"
          variant="subtitle2"
          color="primary.main"
          sx={{ cursor: "pointer", fontSize: "0.82rem" }}
          href={redirectVariantUrl(id)}
        >
          {name}
        </Link>
        <Typography fontSize={"0.82rem"} className="sku-label">
          {`${INVENTORY_LOG_LABEL.SKU}: ${SKU_code}`}
        </Typography>
        {total_inventory !== undefined && (
          <Typography fontSize={"0.82rem"} className="sku-label">
            {`${INVENTORY_LOG_LABEL.inventory}: ${formatFloatToString(total_inventory.toString())}`}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default InventoryItem;

const styles: TStyles<"wrapper"> = {
  wrapper: { display: "flex", flexDirection: "row" },
};
