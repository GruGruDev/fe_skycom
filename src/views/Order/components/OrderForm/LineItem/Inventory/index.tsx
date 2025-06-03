import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import { Span } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { FieldError } from "react-hook-form";
import { TBatchSheet } from "types/Sheet";
import InventoryItem from "./InventoryItem";
import { findOption } from "utils/option";

export interface InventoryProps {
  inventories?: Partial<TBatchSheet>[];
  quantity: number;
  error?: FieldError;
  onChangeInventory?: (payload: { batch: string; warehouse: string }) => void;
  value?: string;
}

const Inventory = ({
  inventories = [],
  quantity,
  error,
  onChangeInventory,
  value = "",
}: InventoryProps) => {
  const handleChangeInventory = (batch: string) => {
    const inventorySelected = findOption(inventories, batch, "batch_id");
    if (inventorySelected) {
      const { batch_id = "", inventories = [] } = inventorySelected;
      const warehouse_id = inventories[0]?.warehouse_id;

      onChangeInventory?.({ batch: batch_id, warehouse: warehouse_id });
    }
  };

  return (
    <>
      {error && <FormHelperText error>{error.message}</FormHelperText>}
      {inventories.length > 0 ? (
        <FormControl>
          <RadioGroup
            aria-labelledby="batch-radio-buttons-group-label"
            name="batch-radio-buttons-group"
            onChange={(_e, value) => handleChangeInventory(value)}
            value={value}
          >
            {inventories.map((item, index) => (
              <InventoryItem
                {...item}
                key={index}
                formLabelProps={{ disabled: quantity > (item.total_inventory || 0) }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ) : (
        <Span sx={{ backgroundColor: "warning.main", width: "fit-content", marginY: 1 }}>
          {ORDER_LABEL.not_have_batch_warehouse_info}
        </Span>
      )}
    </>
  );
};

export default Inventory;
