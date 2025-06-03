import find from "lodash/find";
import { TWarehouse, WarehouseDTO } from "types/Warehouse";

export const handleFormatResWarehouseToForm = (row: Partial<TWarehouse> = {}) => {
  const { id, manager_name, manager_phone, name, note, addresses } = row;

  const address = find(addresses, (addr) => addr.is_default === true) || addresses?.[0];

  const form: Partial<WarehouseDTO> = {
    ...row,
    id: id ?? "",
    name: name ?? "",
    manager_phone: manager_phone ?? "",
    manager_name: manager_name ?? "",
    note: note ?? "",
    address: { ...address, address: address?.address ?? "", type: "WH", id: address?.id ?? "new" },
  };
  return form;
};
