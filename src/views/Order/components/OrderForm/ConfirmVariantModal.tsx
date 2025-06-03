import Typography from "@mui/material/Typography";
import { FormDialog } from "components/Dialogs";
import { BUTTON } from "constants/button";
import { ORDER_LABEL } from "constants/order/label";
import map from "lodash/map";
import React, { FC } from "react";
import { OrderLineItemDTO } from "types/Order";
import { Variant, VariantProps } from "./LineItem/Variant";

interface Props extends Omit<VariantProps, "value"> {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  totalQuantity: {
    [key: string]: Partial<OrderLineItemDTO>;
  };
  isDenyConfirm?: boolean;
}

const ConfirmVariantModal: FC<Props> = ({
  open,
  setOpen,
  onSubmit,
  loading,
  totalQuantity,
  isDenyConfirm,
  listInventory = [],
  listInventoryInOrder,
}) => {
  return (
    <FormDialog
      maxWidth={"md"}
      buttonText={BUTTON.CONFIRM}
      title={BUTTON.CONFIRM}
      open={open}
      onSubmit={onSubmit}
      onClose={() => setOpen(false)}
      loading={loading}
    >
      {isDenyConfirm ? (
        <Typography color="warning.main" fontSize="0.82rem">
          {ORDER_LABEL.cannot_confirm_order}
        </Typography>
      ) : null}
      {map(Object.keys(totalQuantity), (item: keyof typeof totalQuantity, index) => {
        return (
          <Variant
            key={index}
            value={totalQuantity[item]}
            index={index}
            hiddenColumns={["price", "total", "cross_sale", "neo_price", "combo"]}
            isShowInventoryAvailable
            listInventoryInOrder={listInventoryInOrder}
            listInventory={listInventory}
          />
        );
      })}
    </FormDialog>
  );
};

export default ConfirmVariantModal;
