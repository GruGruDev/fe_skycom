import { GridWrapHeaderProps, HeaderWrapper } from "components/Table/Header";

export interface HeaderWarehouseProps
  extends Partial<
    Omit<
      GridWrapHeaderProps,
      | "filterChipCount"
      | "setFilterCount"
      | "onClearAll"
      | "onDelete"
      | "rightChildren"
      | "filterOptions"
      | "filterChipOptions"
    >
  > {}

const Header = (props: HeaderWarehouseProps) => {
  return <HeaderWrapper {...props}></HeaderWrapper>;
};

export default Header;
