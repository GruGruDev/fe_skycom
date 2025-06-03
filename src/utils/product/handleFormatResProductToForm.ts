import { TProduct } from "types/Product";

// product
export const handleFormatResProductToForm = (row: Partial<TProduct> = {}) => {
  const { name, note, id } = row;

  const form: Partial<TProduct> = {
    ...row,
    id: id ?? "",
    name: name ?? "",
    note: note ?? "",
  };
  return form;
};
