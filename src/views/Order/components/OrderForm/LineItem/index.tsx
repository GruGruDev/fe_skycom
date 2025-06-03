import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SearchVariantModal } from "components/Product";
import { Section, TitleSection } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { memo } from "react";
import { FieldErrors } from "react-hook-form";
import { OrderLineItemDTO } from "types/Order";
import { TStyles } from "types/Styles";
import { ListVariant, ListVariantProps } from "./ListVariant";

interface LineItemProps extends ListVariantProps {
  rowId?: string;
  error?: FieldErrors<OrderLineItemDTO>;
  line_items: Partial<OrderLineItemDTO>[];
}
const LineItem = (props: LineItemProps) => {
  const { line_items, error, rowId } = props;
  const { warehouseIds } = useAppSelector(getDraftSafeSelector("warehouses"));

  return (
    <Section elevation={3} sx={{ mb: 2, p: 1 }}>
      <Stack direction={"row"} justifyContent="space-between">
        <TitleSection>{ORDER_LABEL.product}</TitleSection>
        <Typography fontSize={"0.825rem"} color={"warning.dark"}>
          {warehouseIds.length ? "" : ORDER_LABEL.create_sale_warehouse_to_get_inventory}
        </Typography>
      </Stack>

      <Divider sx={{ my: 1, mb: 2 }} />
      {!rowId && (
        <SearchVariantModal
          setSelectedProduct={(products) => props.setListVariants([...line_items, ...products])}
          error={error as any}
          hiddenColumns={["combo", "cross_sale", "quantity", "total", "neo_price"]}
        />
      )}

      <ListVariant
        {...props}
        isUpdate={!rowId}
        isDelete={!rowId}
        style={styles.variant}
        selectedVariants={line_items}
        error={error}
        selectedWarehouses={warehouseIds}
        isShowInventoryActual
        isShowInventoryAvailable
        hiddenColumns={["combo", "cross_sale", "neo_price"]}
      />
    </Section>
  );
};

export default memo(LineItem);

const styles: TStyles<"variant"> = {
  variant: { marginTop: 12 },
};
