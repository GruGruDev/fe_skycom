import { OrderLineItemDTO } from "types/Order";
import omit from "lodash/omit";

// gộp variant - combo - promotion
export const handleUniqVariant = ({
  prev = [],
  line_items = [],
  isUniqCombo,
}: {
  prev?: Partial<OrderLineItemDTO>[];
  line_items?: Partial<OrderLineItemDTO>[];
  isUniqCombo?: boolean;
}) => {
  let preClone = [...prev];
  line_items?.map((variant) => {
    if (variant?.items_promotion && variant?.items_promotion?.length > 0) {
      variant?.items_promotion?.map((item) => {
        preClone = onAddList({ prev: preClone, variant: item, isUniqCombo });
      });
    }
    if (isUniqCombo && variant?.items_combo && variant?.items_combo?.length > 0) {
      variant?.items_combo?.map((item) => {
        preClone = onAddList({ prev: preClone, variant: item, isUniqCombo });
      });
    }
    preClone = onAddList({ prev: preClone, variant, isUniqCombo });
  });
  return preClone;
};

const onAddList = ({
  isUniqCombo,
  variant,
  prev,
}: {
  prev: Partial<OrderLineItemDTO>[];
  variant: Partial<OrderLineItemDTO>;
  isUniqCombo?: boolean;
}) => {
  const prevClone = [...prev];
  const index = prev.findIndex(
    (prevProduct: Partial<OrderLineItemDTO>) => prevProduct.id === variant.id,
  );

  let newVariant = variant;
  if (isUniqCombo) {
    newVariant = omit(newVariant, ["items_combo", "combo_variants"]);
  }

  if (index !== -1) {
    const temp = {
      ...newVariant,
      quantity: (prevClone[index]?.quantity || 0) + (variant?.quantity || 0),
    };
    prevClone[index] = temp;
  } else {
    prevClone.push(newVariant);
  }
  return prevClone;
};
