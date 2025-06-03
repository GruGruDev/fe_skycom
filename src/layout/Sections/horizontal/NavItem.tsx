import { ReactElement, forwardRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { ListItemStyle } from "./style";
import { isExternalLink } from "..";
import { TNavItemProps, TNaviListProps } from "types/NavSection";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// ----------------------------------------------------------------------

export const NavItemRoot = forwardRef<HTMLButtonElement & HTMLAnchorElement, TNavItemProps>(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { title, path, icon, children, onClick } = item;

    if (children) {
      return (
        <ListItemStyle
          ref={ref}
          open={open}
          activeRoot={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavItemContent icon={icon} title={title}>
            {children}
          </NavItemContent>
        </ListItemStyle>
      );
    }

    return onClick ? (
      <ListItemStyle onClick={onClick}>
        <NavItemContent icon={icon} title={title}>
          {children}
        </NavItemContent>
      </ListItemStyle>
    ) : isExternalLink(path) ? (
      <ListItemStyle component={Link} href={path}>
        <NavItemContent icon={icon} title={title}>
          {children}
        </NavItemContent>
      </ListItemStyle>
    ) : (
      <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
        <NavItemContent icon={icon} title={title}>
          {children}
        </NavItemContent>
      </ListItemStyle>
    );
  },
);

// ----------------------------------------------------------------------

export const NavItemSub = forwardRef<HTMLButtonElement & HTMLAnchorElement, TNavItemProps>(
  ({ item, active, open, onMouseEnter, onMouseLeave }, ref) => {
    const { title, path, icon, children, roles } = item;

    if (children) {
      return (
        <ListItemStyle
          ref={ref}
          subItem
          disableRipple
          open={open}
          activeSub={active}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavItemContent icon={icon} title={title} subItem>
            {children}
          </NavItemContent>
        </ListItemStyle>
      );
    }

    return roles ? (
      <>
        {isExternalLink(path) ? (
          <ListItemStyle subItem href={path} disableRipple component={Link}>
            <NavItemContent icon={icon} title={title} subItem>
              {children}
            </NavItemContent>
          </ListItemStyle>
        ) : (
          <ListItemStyle disableRipple component={RouterLink} to={path} activeSub={active} subItem>
            <NavItemContent icon={icon} title={title} subItem>
              {children}
            </NavItemContent>
          </ListItemStyle>
        )}
      </>
    ) : null;
  },
);

// ----------------------------------------------------------------------

type NavItemContentProps = {
  title: string;
  icon?: ReactElement;
  children?: TNaviListProps[];
  subItem?: boolean;
};

function NavItemContent({ icon, title, children, subItem }: NavItemContentProps) {
  return (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
            "& svg": { width: "100%", height: "100%" },
          }}
        >
          {icon}
        </Box>
      )}
      {title}
      {children && (
        <Box
          sx={{
            ml: 0.5,
            width: ICON.NAVBAR_ITEM_HORIZONTAL,
            height: ICON.NAVBAR_ITEM_HORIZONTAL,
          }}
        >
          {subItem ? <ChevronRightIcon /> : <KeyboardArrowDownIcon />}
        </Box>
      )}
    </>
  );
}
