import { createSlice } from "@reduxjs/toolkit";
import { TAttribute } from "types/Attribute";
import { TWarehouse } from "types/Warehouse";
import { forOf } from "utils/forOf";

export interface WarehouseState {
  warehouses: TWarehouse[];
  warehouseIds: string[];
  saleWarehouseIds: string[];
  saleWarehouses: TWarehouse[];
  warehouseDefault?: TWarehouse;
  inventoryReasons: TAttribute[];
}

const initialState: WarehouseState = {
  warehouses: [],
  warehouseIds: [],
  saleWarehouseIds: [],
  saleWarehouses: [],
  inventoryReasons: [],
};

export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    getWarehouseRes: (state, action) => {
      const { payload } = action;

      state.warehouses = payload;

      let saleWarehouseIds: string[] = [];
      let warehouseIds: string[] = [];
      let saleWarehouses: TWarehouse[] = [];

      forOf<TWarehouse>(payload, (item) => {
        warehouseIds.push(item.id);
        if (item.is_sales) {
          saleWarehouseIds.push(item.id);
          saleWarehouses.push(item);
        }
        if (item.is_default) {
          state.warehouseDefault = item;
        }
      });
      state.warehouseIds = warehouseIds;
      state.saleWarehouseIds = saleWarehouseIds;
      state.saleWarehouses = saleWarehouses;
    },
    getInventoryReasonRes: (state, action) => {
      const { payload } = action;

      state.inventoryReasons = payload;
    },
    addInventoryReasonRes: (state, action) => {
      const { payload } = action;

      const reasons = [...state.inventoryReasons];

      state.inventoryReasons = [...reasons, payload];
    },
    updateInventoryReasonRes: (state, action) => {
      const { payload } = action;

      const reasons = [...state.inventoryReasons];
      const idx = reasons.findIndex((item) => item.id === payload.id);
      reasons.splice(idx, 1, payload);

      state.inventoryReasons = reasons;
    },
    removeInventoryReasonRes: (state, action) => {
      const { payload } = action;

      const reasons = [...state.inventoryReasons];
      const newInventoryReasons = reasons.filter((item) => item.id !== payload);

      state.inventoryReasons = newInventoryReasons;
    },
  },
});

export default warehouseSlice.reducer;

export const {
  getWarehouseRes,
  addInventoryReasonRes,
  removeInventoryReasonRes,
  updateInventoryReasonRes,
  getInventoryReasonRes,
} = warehouseSlice.actions;
