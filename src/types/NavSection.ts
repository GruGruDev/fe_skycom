import { MouseEventHandler, ReactElement } from "react";
import { BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

export type TNaviListProps = {
  title: string;
  path?: string;
  icon?: ReactElement;
  info?: ReactElement;
  children?: TNaviListProps[];
  roles?: boolean;
  onClick?: VoidFunction;
  code?: string;
};

export type TNavItemProps<T = any> = {
  item: TNaviListProps;
  isCollapse?: boolean;
  active?: boolean | undefined;
  open?: boolean;
  onOpen?: VoidFunction;
  onMouseEnter?: MouseEventHandler<T>;
  onMouseLeave?: MouseEventHandler<T>;
};

export interface TNavSectionProps extends BoxProps {
  isCollapse?: boolean;
  navConfig: {
    subheader: string;
    items: TNaviListProps[];
  }[];
}
