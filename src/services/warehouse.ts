import { warehouseApi } from "apis/warehouse";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TWarehouse, WarehouseDTO } from "types/Warehouse";
import { addressServices } from "./address";
import omit from "lodash/omit";

const getWarehouses = async (params: any) => {
  const result = await warehouseApi.get<TWarehouse>({
    params,
    endpoint: "",
  });

  if (result?.data) {
    return result.data;
  }
  if (result.error.name === CANCEL_REQUEST) {
    return;
  }
};

const handleCreateWarehouse = async (form: Partial<WarehouseDTO>) => {
  const res = await warehouseApi.create<TWarehouse>({ params: form });

  if (res.data) {
    const addressRes = await addressServices.handleCreateLocation({
      ward: form.address?.ward,
      address: form.address?.address,
      warehouse: res.data.id,
      is_default: true,
      type: "WH",
    });

    if (addressRes) {
      return res.data;
    }
    return;
  } else return;
};

const handleUpdateWarehouse = async (
  form: Partial<WarehouseDTO>,
  rowId: string,
  addressId?: string,
) => {
  const { address } = form;
  const payload = omit(form, "address");

  let res: { data: TWarehouse | null };
  if (Object.keys(payload).length) {
    res = await warehouseApi.update({
      params: payload,
      endpoint: `${rowId}/`,
    });
    return res.data;
  }
  if (address && addressId) {
    const addressRes = await addressServices.handleUpdateLocation({
      id: addressId,
      ward: address?.ward,
      is_default: true,
      address: address?.address,
      warehouse: form?.id,
      type: "WH",
    });
    return addressRes;
  }
  return;
};

export const warehouseServices = {
  getWarehouses,
  handleCreateWarehouse,
  handleUpdateWarehouse,
};
