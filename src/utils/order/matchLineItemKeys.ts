import reduce from "lodash/reduce";
import { OrderLineItemDTO } from "types/Order";
import { TComboVariant } from "types/Product";

export const matchLineItemKeys = (line_items: Partial<OrderLineItemDTO>[]) => {
  const productList = reduce(
    line_items,
    (prev: Partial<OrderLineItemDTO>[], current = {}) => {
      const { variant, items_combo, combo_variants } = current;

      const comboVariants = items_combo?.length ? items_combo : combo_variants;
      const matchVariant = { ...variant, ...current };
      const temp: Partial<OrderLineItemDTO> = {
        ...matchVariant,
        id: variant?.id || matchVariant.id,
        items_combo: comboVariants?.map((item) => groupComboVariant(item, matchVariant.quantity)),
      };

      const currentExistedIndex = prev.findIndex((itemPrev) => itemPrev.id === temp.id);

      if (currentExistedIndex === -1) {
        prev = [...prev, temp];
      } else {
        prev[currentExistedIndex] = {
          ...prev[currentExistedIndex],
          quantity: (prev[currentExistedIndex]?.quantity || 0) + (temp.quantity || 0),
        };
      }

      return prev;
    },
    [],
  );
  return productList;
};

const groupComboVariant = (
  variant: Partial<Omit<OrderLineItemDTO, "items_combo">> & TComboVariant,
  comboQuantity: number = 0,
): Partial<OrderLineItemDTO> => {
  const { quantity = 0 } = variant;
  const matchVariant = variant.variant || variant.detail_variant;
  return {
    ...matchVariant,
    ...variant,
    id: matchVariant?.id,
    quantity: quantity * comboQuantity,
  };
};
