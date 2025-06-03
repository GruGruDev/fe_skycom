import { OrderLineItemDTO } from "types/Order";
import { forOf } from "utils/forOf";

export const handleCaclCrossSale = (lineItems: Partial<OrderLineItemDTO>[] = []) => {
  let crossSaleValue = 0;

  forOf(lineItems, (item) => {
    const { quantity = 0, sale_price = 0 } = item;
    if (item.is_cross_sale) {
      crossSaleValue += quantity * sale_price;
    }
  });
  return {
    crossSaleValue,
    isCrossSale: !!crossSaleValue,
  };
};
