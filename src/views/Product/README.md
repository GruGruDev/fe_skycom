## Cơ sở dữ liệu:

### Sản phẩm đơn

- chứa danh sách variants

### Combo

- chứa danh sách variants(danh sách chỉ có 1 item variant) => 1 variant chứa danh sách combo_variants

## Page:

### Sản phẩm đơn

- tạo `product/ variants` chung modal
- chế độ `product`:
  - chứa danh sách product => mỗi row chứa product cho phép cập nhật thông tin `product`, tạo `variant`
  - chi tiết mỗi product chứa danh sách variants => mỗi dòng variant cho phép cập nhật thông tin `variant`
- chế độ `variants`:
  - chứa danh sách variants => mỗi dòng variant cho phép cập nhật thông tin `variant`
  - không có chi tiết

### Combo

- tạo `product/variant` chung 1 modal
- chế độ `product`:
  - chứa danh sách product => mỗi row chứa product cho phép cập nhật thông tin `product`
  - chi tiết mỗi product chứa 1 variant => cho phép cập nhật thông tin `variant` (không cho phép cập nhật giá)
- chế độ `variant`:
  - chứa danh sách combo_variants => mỗi dòng variant cho phép cập nhật thông tin `variant` (không cho phép cập nhật giá)
  - không có chi tiết
