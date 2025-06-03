import { NavLink as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import ListItemText from "@mui/material/ListItemText";
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from "./style";
import { isExternalLink } from "..";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { TNavItemProps } from "types/NavSection";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// ----------------------------------------------------------------------

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }: TNavItemProps) {
  const { title, path, icon, info, children, onClick } = item;

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {!isCollapse && (
        <>
          {info && info}
          {children && <ArrowIcon open={open} />}
        </>
      )}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeRoot={active}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return onClick ? (
    <ListItemStyle onClick={onClick}>{renderContent}</ListItemStyle>
  ) : isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path}>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

type NavItemSubProps = Omit<TNavItemProps, "isCollapse">;

export function NavItemSub({ item, open = false, active = false, onOpen }: NavItemSubProps) {
  const { title, path, info, children } = item;

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeSub={active} subItem>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

type DotIconProps = {
  active: boolean;
};

export function DotIcon({ active }: DotIconProps) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: "scale(2)",
            bgcolor: "primary.main",
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

// ----------------------------------------------------------------------

type ArrowIconProps = {
  open: boolean;
};

export function ArrowIcon({ open }: ArrowIconProps) {
  return (
    <Box sx={{ width: 16, height: 16, ml: 1 }}>
      {open ? <ArrowDownwardIcon /> : <ArrowForwardIcon />}
    </Box>
  );
}
