## Xử lý Form

### A. line_items

- 1. thay đổi danh sách variant => reset `payments` => reset `order price` (3,4,5,6) => tính lại `order price`
- 2. thay đổi promotion trong variant
  - lấy danh sách promotions => gán cho promotions của line_item luôn
  - khi chọn 1 promotion item => gán selected = true cho promotion item đó
  - nếu promotion có type là `PRICE` => gán discount = price_value =>
    - check discount > requirement_maximum_value_discount => discount = requirement_maximum_value_discount
    - check discount > ( sale_price* quantity ) => discount = sale_price* quantity
  - nếu promotion có type là `PERCENT` => discount = sale_price _ quantity _ percent_value / 100
    - check discount > requirement_maximum_value_discount => discount = requirement_maximum_value_discount
    - check discount > ( sale_price* quantity ) => discount = sale_price* quantity
  - nếu promotion có type là `OTHER_VARIANT` => cho chọn danh sách variant trong other_variants => nếu variant nào được chọn thì gán selected = true cho variant đó
  - => quay lại bước 1

### B. order price

**Bao gồm các trường**

<!-- 1. giá tiền của sản phẩm chưa được giảm giá -->

- 1. price_total_variant_all: number;
  <!-- 2. giá tiền của sản phẩm đã được giảm giá -->
- 2. price_total_variant_actual: number;
  <!-- 3. giá tiền của khuyến mãi đơn hàng -->
- 3. price_total_discount_order_promotion: number;
  <!-- 4. giá tiền của ô nhập giảm giá -->
- 4. price_discount_input: number;
  <!-- 5. giá tiền của ô chi phí vận chuyển -->
- 5. price_delivery_input: number;
  <!-- 6. giá tiền của ô phụ thu -->
- 6. price_addition_input: number;
  <!-- 7. giá tiền của 2-3-4+5+6 -->
- 7. price_total_order_actual: number;
  <!-- 8. giá tiền chuyển khoản -->
- 8. price_pre_paid: number; // = price_from_order trong payment có type `DIRECT_TRANSFER`
  <!-- 9. giá tiền thanh toán cuối cùng sau khi chuyển khoản = 7-8 -->
- 9. price_after_paid: number;

**Xử lý**

- khi thay đổi price_total_discount_order_promotion => reset `payments` và các trường còn lại của `order price`

### C. payments

Có type trạng thái tĩnh (`COD/ CASH`) - chuyển khoản (`DIRECT_TRANSFER`)

- nếu payment type `DIRECT_TRANSFER` mà có price_from_order không bằng price_total_order_actual thì phải có thêm 1 item payment có type thuộc `COD/ CASH`

### D. customer

- chọn customer => lấy id đi get danh sách addresses, danh sách phones lấy từ thông tin customer của order trả về
  => match phone_shipping vào phones và address_shipping vào addresses
