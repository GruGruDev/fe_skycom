import reduce from "lodash/reduce";
import { OrderDTOV2, OrderLineItemDTO } from "types/Order";
import { TComboVariant } from "types/Product";

export const handleFormatResToForm = (row: Partial<OrderDTOV2> = {}): Partial<OrderDTOV2> => {
  // dòng này là reset payment với order có trạng thái cancel
  // const payment = row?.status?.status === "cancel" ? defaultOrderForm.payment : row?.payment;
  // const id = row?.id ? (row?.status === "cancel" ? undefined : row.id) : undefined;
  const { line_items, source, sale_note, delivery_note } = row;

  const lineItems = reduce(
    line_items,
    (prev: Partial<OrderLineItemDTO>[], cur) => {
      let lineItem: Partial<OrderLineItemDTO> = {
        ...cur.variant,
        ...cur,
        id: cur.variant?.id,
        selected: true,
      };
      const itemsCombo = reduce(
        cur.items_combo,
        (prevItems: TComboVariant[], curItem: Partial<Omit<OrderLineItemDTO, "items_combo">>) => {
          return [
            ...prevItems,
            { ...curItem, id: curItem.variant?.id, detail_variant: curItem.variant },
          ];
        },
        [],
      );

      lineItem = { ...lineItem, combo_variants: itemsCombo };

      return [...prev, { ...lineItem }];
    },
    [],
  );

  return {
    ...row,
    line_items: lineItems,
    source,
    sale_note: sale_note ?? "",
    delivery_note: delivery_note ?? "",
  };
};
