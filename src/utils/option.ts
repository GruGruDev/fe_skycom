import { NONE } from "constants/index";
import reduce from "lodash/reduce";
import find from "lodash/find";
import { TAttribute } from "types/Attribute";
import { TPhone } from "types/Customer";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";

export const formatOptionAttribute = (
  option: TAttribute = {},
  valueKey: keyof TAttribute = "id",
  nameKey: keyof TAttribute = "name",
): Partial<TAttribute> => {
  return { id: option[valueKey] as TAttribute["id"], name: option[nameKey] as TAttribute["name"] };
};

export const formatOptionSelect = (option: TAttribute | TUser = {}): TSelectOption => {
  const { name = "", id = "" } = option;
  return { label: name, value: id };
};

export const filterIsShowOptions = (attributes: TAttribute[]) => {
  return attributes?.length
    ? attributes.reduce((prevArr: TSelectOption[], current: TAttribute) => {
        return [...prevArr, formatOptionSelect(current)];
      }, [])
    : [];
};

export const findOption = <T>(
  options?: T[],
  value?: string | number | boolean,
  key: string = "id",
) => {
  return find(options, (item) => (item as any)?.[key] === value);
};

export const findNoneAttribute = (options: TAttribute[]) => {
  return findOption(options, NONE, "name");
};

export const getPhoneAttribute = ({ options = [] }: { options?: Partial<TPhone>[] }) => {
  return reduce(
    options,
    (prev: string[], cur) => {
      return [...prev, cur.phone as string];
    },
    [],
  );
};
