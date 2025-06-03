import reduce from "lodash/reduce";
import { CustomerDTO, TCustomer } from "types/Customer";

export const handleFormatResToForm = (row: Partial<TCustomer> = {}) => {
  const { name } = row;

  const tags = reduce(
    row?.tags,
    (prev: string[], cur) => {
      return [...prev, cur.id || ""];
    },
    [],
  );

  const customer: Partial<CustomerDTO> = {
    ...row,
    name: name ?? "",
    tags,
  };
  return customer;
};
