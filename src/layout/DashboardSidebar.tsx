import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import { Avatar, Box, Button, Divider, Drawer, Stack, Typography, useTheme } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Logo } from "components/Images";
import { MHidden } from "components/MHidden";
import { MPopover } from "components/Popovers";
import { ROLE_TAB } from "constants/role";
import { useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import useSettings from "hooks/useSettings";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { handleToggleCollapse, sidebarStore } from "store/redux/sidebar/slice";
import { showError } from "utils/toast";
import NavSection from "./Sections/NavSection";
import SidebarConfig from "./SidebarConfig";

import DEFAULT_AVATAR from "assets/images/avatar_default.jpg";
import { LABEL } from "constants/label";
import { DRAWER_WIDTH, COLLAPSE_WIDTH } from "constants/index";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type IconCollapseProps = {
  onToggleCollapse: VoidFunction;
  collapseClick: boolean;
};

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

const DashboardSidebar = ({ isOpenSidebar, onCloseSidebar }: DashboardSidebarProps) => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { themeLayout, settings, setSettings, onShowModal, isOpenModal } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { click, hover } = useAppSelector(sidebarStore);
  const isCollapse = themeLayout === "vertical_collapsed";

  const handleClose = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await logout?.();
      navigate("/");
      handleClose(event);
    } catch (error) {
      console.error(error);
      showError(LABEL.CANNOT_LOGOUT);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);

  useEffect(() => {
    if (isCollapse) {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }
    }

    prevOpen.current = open;
  }, [isCollapse, open]);

  const renderContent = (
    <>
      <Stack
        spacing={3}
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2,
          ...(isCollapse && { alignItems: "center" }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box component={RouterLink} to={`/`} sx={{ display: "inline-flex", width: "100%" }}>
            <Logo isCollapse={isCollapse} />
          </Box>
        </Stack>

        {isCollapse ? (
          <Avatar
            onMouseDown={() => navigate(`/${ROLE_TAB.PROFILE}`)}
            alt="My Avatar"
            src={user?.images?.[0]?.image || DEFAULT_AVATAR}
            sx={{ mx: "auto", mb: 2, cursor: "pointer" }}
          />
        ) : (
          <Stack direction="column" spacing={0.5} sx={{ mt: 1 }}>
            <AccountStyle onClick={() => navigate(`/${ROLE_TAB.PROFILE}`)} ref={anchorRef as any}>
              <Avatar alt="My Avatar" src={user?.images?.[0]?.image || DEFAULT_AVATAR} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {user?.role?.name}
                </Typography>
              </Box>
            </AccountStyle>
          </Stack>
        )}

        <MPopover
          open={open}
          onClose={handleClose}
          anchorEl={anchorRef.current}
          sx={{ width: 240 }}
        >
          <Stack direction="row" alignItems="center">
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle1" noWrap>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                {user?.email}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ p: 2, pt: 1.5 }}>
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              onClick={(e: any) => handleLogout(e)}
            >
              Logout
            </Button>
          </Box>
        </MPopover>
      </Stack>

      <NavSection
        navConfig={SidebarConfig({
          handleShowThemeModal: () => onShowModal(!isOpenModal),
        })}
        isShow={!isCollapse}
      />
    </>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH,
        },
      }}
      isCollapse={isCollapse}
    >
      <MHidden width="lgDown">
        <CollapseButton
          onToggleCollapse={() => {
            handleToggleCollapse();
            setSettings &&
              setSettings({
                ...settings,
                themeLayout:
                  themeLayout === "vertical_collapsed" ? "vertical" : "vertical_collapsed",
              });
          }}
          collapseClick={click}
        />
      </MHidden>

      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              transition: theme.transitions.create("width", {
                duration: "0.75s",
                easing: theme.transitions.easing.easeInOut,
              }),
              "::-webkit-scrollbar": {
                width: 5,
                height: 8,
              },
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              transition: theme.transitions.create("width", {
                duration: "0.75s",
                easing: theme.transitions.easing.easeInOut,
              }),
              bgcolor: "background.default",
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
              ...(hover && {
                borderRight: 0,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
                boxShadow: (theme) => theme.customShadows.z20,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.88),
              }),
              "::-webkit-scrollbar": {
                width: 5,
                height: 8,
              },
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
};

export default DashboardSidebar;

const CollapseButton = ({ onToggleCollapse, collapseClick }: IconCollapseProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        position: "absolute",
        border: `1px dashed ${theme.palette.grey[400]}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 32,
        right: -15,
        backgroundColor: theme.palette.background.default,
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={onToggleCollapse}
    >
      <KeyboardArrowLeftRoundedIcon
        sx={{
          color: theme.palette.grey[600],
          transition: theme.transitions.create("transform", {
            duration: "0.75s",
            easing: theme.transitions.easing.easeInOut,
          }),
          ...(collapseClick && {
            transform: "rotate(180deg)",
          }),
        }}
      />
    </Box>
  );
};

const RootStyle: any = styled("div", {
  shouldForwardProp: (props) => props !== "isCollapse",
})(({ theme }: any) => ({
  zIndex: 1,
  position: "fixed",
  background: theme.palette.background.default,
  height: "100%",
  ".MuiDrawer-root .MuiPaper-root": {
    borderStyle: "dashed",
    zIndex: 1,
  },
  transition: theme.transitions.create("width", {
    duration: "0.75s",
    easing: theme.transitions.easing.easeInOut,
  }),
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12],
  cursor: "pointer",
}));
