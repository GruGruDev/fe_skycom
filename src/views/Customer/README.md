## Customer

### Tạo Customer

- Sẽ tạo tên, số điện thoại
- Nếu thay đổi tỉnh thành => validation quận/ phường/ số nhà, tên đường -> thêm địa chỉ

### Cập nhật Customer

> Có thể cập nhật từng phần riêng lẻ (tên/ số điện thoại/ địa chỉ)

- Tên thì phải submit form
- Fill địa chỉ mặc định vào form => khi submit form => thay đổi địa chỉ
- Số điện thoại - chỉ cần thao tác các icon thêm/ xoá trong form

## Quyền

- `Trưởng phòng kinh doanh`: có thể xác nhận đơn hàng
- `Nhân viên kinh doanh`: có thể xử lý đơn hàng

=> Dùng 2 quyền này để fill 1 số selector
