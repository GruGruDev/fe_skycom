import reduce from "lodash/reduce";
import { CustomerDTO, TCustomer } from "types/Customer";

export const handleFormatFormToPayload = (row?: Partial<TCustomer>) => {
  const name = row?.name;
  const tags = reduce(
    row?.tags,
    (prev: string[], cur) => {
      return [...prev, cur.id || ""];
    },
    [],
  );
  const customer: Partial<CustomerDTO> = {
    ...row,
    name,
    tags,
  };
  return customer;
};
