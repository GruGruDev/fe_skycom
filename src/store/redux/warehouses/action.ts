import { warehouseServices } from "services/warehouse";
import { store } from "store";
import {
  getWarehouseRes,
  addInventoryReasonRes,
  getInventoryReasonRes,
  removeInventoryReasonRes,
  updateInventoryReasonRes,
} from "./slice";
import { TAttribute } from "types/Attribute";
import { warehouseApi } from "apis/warehouse";

export const getWarehouses = async () => {
  const result = await warehouseServices.getWarehouses({ limit: 200, page: 1 });

  if (result) {
    const { results = [] } = result;

    store.dispatch(getWarehouseRes(results));
  }
};

export const getListInventoryReasons = async () => {
  const result = await warehouseApi.get<Required<TAttribute>>({
    params: { limit: 500, page: 1 },
    endpoint: "inventory-reasons/",
  });

  if (result.data) {
    const { results = [] } = result.data;

    store.dispatch(getInventoryReasonRes(results));
  }
};

export const createInventoryReason = async (row: TAttribute) => {
  const result = await warehouseApi.create<TAttribute>({
    params: { name: row.name, type: row.type },
    endpoint: "inventory-reasons/",
  });

  if (result.data) {
    store.dispatch(addInventoryReasonRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const updateInventoryReason = async (row: TAttribute) => {
  const { name, id } = row;

  const result = await warehouseApi.update<TAttribute>({
    params: { name },
    endpoint: `inventory-reasons/${id}/`,
  });

  if (result.data) {
    store.dispatch(updateInventoryReasonRes(result.data));
    return true;
  } else {
    return false;
  }
};

export const removeInventoryReason = async (row: TAttribute) => {
  const { id } = row;

  const result = await warehouseApi.remove({
    endpoint: `inventory-reasons/${id}/`,
  });

  if (result?.status === 204) {
    store.dispatch(removeInventoryReasonRes(id));
    return true;
  } else {
    return false;
  }
};
