import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { BoxProps, ListItemButtonProps } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grow from "@mui/material/Grow";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { THEME_TITLE } from "layout/SidebarConfig";
import map from "lodash/map";
import { useState } from "react";
import { NavLink as RouterLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import { TNaviListProps } from "types/NavSection";
import { TStyles } from "types/Styles";

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props: any) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  color: theme.palette.text.primary,
}));

interface ListItemStyleProps extends ListItemButtonProps {
  to?: string;
}

const ListItemStyle = styled(ListItemButton)<ListItemStyleProps>(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

function NavItem({ item }: { item: TNaviListProps }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, info, children, onClick } = item;
  const isHasActiveSub = children
    ? children.some((item) => item.path && !!matchPath({ path: item.path, end: false }, pathname))
    : false;
  const isActiveRoot = (path && !!matchPath({ path, end: false }, pathname)) || isHasActiveSub;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  const activeRootStyle = {
    color: "primary.main",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "text.primary",
    fontWeight: "fontWeightMedium",
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
          style={{ display: item.roles ? undefined : "none" }}
        >
          <ListItemIconStyle>{icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info}
          <Box sx={{ width: 16, height: 16, ml: 1 }}>
            {open ? (
              // eslint-disable-next-line no-inline-styles/no-inline-styles
              <KeyboardArrowDownIcon style={{ fontSize: "1rem" }} />
            ) : (
              // eslint-disable-next-line no-inline-styles/no-inline-styles
              <KeyboardArrowRightIcon style={{ fontSize: "1rem" }} />
            )}
          </Box>
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            style={{
              display: item.roles ? undefined : "none",
            }}
          >
            {map(children, (item) => {
              const { title, path } = item;
              const isActiveSub = path ? !!matchPath({ path, end: false }, pathname) : false;

              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle),
                  }}
                  style={{
                    display: item.roles ? undefined : "none",
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: "flex",
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "text.disabled",
                        transition: (theme) =>
                          theme.transitions.create("transform", {
                            duration: "0.5s",
                            easing: theme.transitions.easing.easeInOut,
                          }),
                        ...(isActiveSub && {
                          transform: "scale(2)",
                          bgcolor: "primary.main",
                        }),
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={path ? RouterLink : "span"}
      onClick={onClick}
      to={path}
      sx={{
        ...(isActiveRoot && title !== THEME_TITLE && activeRootStyle),
      }}
    >
      <ListItemIconStyle>{icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={title} />
      {info}
    </ListItemStyle>
  );
}

function CollapseNavItem({
  item,
  handleOpen,
  handleClose,
  handleNavigation,
}: {
  item: TNaviListProps;
  handleOpen: (event: React.MouseEvent<HTMLElement>, item: TNaviListProps[]) => void;
  handleClose: () => void;
  handleNavigation: (value?: string) => void;
}) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, children, onClick } = item;
  const isHasActiveSub = children
    ? children.some((item) => item.path && !!matchPath({ path: item.path, end: false }, pathname))
    : false;
  const isActiveRoot = (path && !!matchPath({ path, end: false }, pathname)) || isHasActiveSub;

  return (
    <ListItem
      disablePadding
      sx={{
        color: theme.palette.text.secondary,
        px: 1,
        position: "relative",
      }}
    >
      <ListItemButton
        sx={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: 1,
          p: 1,
          position: "relative",
          ...(isActiveRoot &&
            title !== THEME_TITLE && {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                color: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }),
        }}
        onMouseEnter={!!children ? (e) => handleOpen(e, children) : handleClose}
        onClick={() => (title === "Theme" ? onClick && onClick() : handleNavigation(item.path))}
      >
        <ListItemIcon sx={{ mr: 0 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={title}
          sx={{
            ".MuiTypography-root": {
              fontSize: 10,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "64px",
              textAlign: "center",
            },
          }}
        />
        {!!children && (
          <KeyboardArrowRightRoundedIcon
            sx={{ position: "absolute", top: 12, right: 6, fontSize: "0.82rem" }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}

interface TNavSectionProps extends BoxProps {
  isShow?: boolean | undefined;
  navConfig: {
    subheader: string;
    items: TNaviListProps[];
  }[];
}

export default function NavSection({ navConfig, isShow = true, ...other }: TNavSectionProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<TNaviListProps[]>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>, children?: TNaviListProps[]) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    children?.length && setCurrentMenu(children);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const id = `transition-popper`;

  const handleNavigation = (path?: string) => {
    path && navigate(path);
  };

  return (
    <Box {...other} style={styles.wrapper} onMouseLeave={handleClose}>
      {map(navConfig, (list) => {
        const { subheader, items } = list;
        const isShowSubHeader = items.some((item) => item.roles);
        return (
          isShowSubHeader && (
            <List key={subheader} disablePadding>
              {isShow ? (
                <ListSubheaderStyle>{subheader}</ListSubheaderStyle>
              ) : (
                <Divider sx={{ margin: "0 20px" }} />
              )}
              {map(items, (item: TNaviListProps, idx) => {
                return item.roles ? (
                  isShow ? (
                    <NavItem key={idx} item={item} />
                  ) : (
                    <CollapseNavItem
                      key={idx}
                      item={item}
                      handleOpen={handleOpen}
                      handleClose={handleClose}
                      handleNavigation={handleNavigation}
                    />
                  )
                ) : null;
              })}
            </List>
          )
        );
      })}

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        style={styles.popover}
        placement="right"
        onMouseLeave={handleClose}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={450}>
            <List
              sx={{
                p: 1,
                backgroundColor: alpha(theme.palette.background.default, 0.93),
                boxShadow: theme.customShadows.z12,
                borderRadius: 1,
              }}
            >
              {map(currentMenu, (item, index) => {
                const isActiveSub = item.path
                  ? !!matchPath({ path: item.path, end: false }, pathname)
                  : false;
                return item.roles ? (
                  <ListItemButton
                    key={index}
                    selected={isActiveSub}
                    sx={{ minWidth: 140, borderRadius: 0.5 }}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ListItemText
                      primary={item.title}
                      sx={{
                        ".MuiTypography-root": {
                          color: theme.palette.text.secondary,
                          fontSize: "0.82rem",
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItemButton>
                ) : null;
              })}
            </List>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

const styles: TStyles<"popover" | "wrapper"> = {
  popover: { zIndex: 1310 },
  wrapper: { paddingBottom: 24 },
};
