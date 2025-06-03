import { TAddress } from "types/Address";

export const addressToString = (item?: Partial<TAddress>) =>
  [item?.address, item?.ward?.ward, item?.ward?.district, item?.ward?.province].join(", ");
