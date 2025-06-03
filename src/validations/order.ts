import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ORDER_LABEL } from "constants/order/label";
import { OrderDTOV2, OrderLineItemDTO } from "types/Order";
import { Shape } from "types/Validation";
import * as yup from "yup";

export const orderSchema = yup
  .object()
  .shape<Shape<Partial<OrderDTOV2>>>({
    // source: yup.object().required(VALIDATION_MESSAGE.SELECT_SOURCE),
    line_items: yup
      .array()
      .of(
        yup.object().shape<Shape<Partial<OrderLineItemDTO>>>({
          sale_price: yup.number().nullable(),
          quantity: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .min(1, VALIDATION_MESSAGE.REQUIRE_AMOUNT)
            .required(VALIDATION_MESSAGE.REQUIRE_AMOUNT),
        }),
      )
      .min(1, VALIDATION_MESSAGE.SELECT_PRODUCT)
      .required(VALIDATION_MESSAGE.SELECT_PRODUCT),
    customer: yup.object().shape({
      id: yup.string().required(VALIDATION_MESSAGE.REQUIRE_CUSTOMER),
    }),
    is_available_discount_input: yup.number().when(["price_discount_input", "price_after_paid"], {
      is: (price_discount_input: number = 0, price_after_paid: number = 0) => {
        return price_discount_input > 0 && price_after_paid < 0;
      },
      then: yup.number().required(ORDER_LABEL.discount_not_apply),
    }),
    // address_shipping: yup
    //   .object()
    //   .when(["customer"], {
    //     is: (customer?: TCustomer) => !!customer,
    //     then: yup.object().shape({
    //       id: yup.string().required(ORDER_LABEL.provide_shipping_address),
    //     }),
    //   })
    //   .required(VALIDATION_MESSAGE.REQUIRE_ADDRESS),
    // is_available_shipping: yup
    //   .bool()
    //   .isTrue(ORDER_LABEL.this_address_cannot_shipping_select_another_address_please),
    payments: yup
      .array()
      .when(["price_after_paid"], {
        is: (price_after_paid: number = 0) => price_after_paid < 0,
        then: yup
          .array()
          .max(0, ORDER_LABEL.recheck_payment_type_please)
          .required(ORDER_LABEL.recheck_payment_type_please),
      })
      .min(1, ORDER_LABEL.select_payment_type_please)
      .required(ORDER_LABEL.select_payment_type_please),
  })
  .required();
