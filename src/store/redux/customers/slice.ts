import { createSlice } from "@reduxjs/toolkit";
import { TAttribute } from "types/Attribute";
import { TRank } from "types/Customer";

export interface AttributesState {
  attributes: { ranks: TRank[]; groups: TAttribute[]; tags: TAttribute[] };
}

const initialState: AttributesState = {
  attributes: { groups: [], tags: [], ranks: [] },
};

export const customerSlice = createSlice({
  name: "customer-attributes",
  initialState,
  reducers: {
    updateAttributesCustomer: (state, action) => {
      const { payload } = action;
      state.attributes = {
        ...state.attributes,
        ...payload,
      };
    },
    addCustomerTagRes: (state, action) => {
      const { payload } = action;
      const tags = [...state.attributes.tags];

      state.attributes.tags = [...tags, payload];
    },
    addGroupRes: (state, action) => {
      const { payload } = action;
      const groups = [...state.attributes.groups];

      state.attributes.groups = [...groups, payload];
    },
    updateGroupRes: (state, action) => {
      const { payload } = action;
      const groups = [...state.attributes.groups];
      groups[payload.index] = payload;

      state.attributes.groups = groups;
    },
    removeGroupRes: (state, action) => {
      const { payload } = action;
      const groups = [...state.attributes.groups];

      state.attributes.groups = groups.filter((item) => item.id !== payload);
    },
    addRankRes: (state, action) => {
      const { payload } = action;
      const ranks = [...state.attributes.ranks];

      state.attributes.ranks = [...ranks, payload];
    },
    updateRankRes: (state, action) => {
      const { payload } = action;
      const ranks = [...state.attributes.ranks];
      ranks[payload.index] = payload;

      state.attributes.ranks = ranks;
    },
    removeRankRes: (state, action) => {
      const { payload } = action;
      const ranks = [...state.attributes.ranks];

      state.attributes.ranks = ranks.filter((item) => item.id !== payload);
    },
  },
});

export default customerSlice.reducer;

export const {
  updateAttributesCustomer,
  addCustomerTagRes,
  addGroupRes,
  removeGroupRes,
  updateGroupRes,
  addRankRes,
  removeRankRes,
  updateRankRes,
} = customerSlice.actions;
