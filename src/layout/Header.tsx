import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import { IconButtonAnimate } from "components/Buttons";
import { Logo } from "components/Images";
import { HEADER, NAVBAR } from "constants/index";
import useOffSetTop from "hooks/useOffSetTop";
import useResponsive from "hooks/useResponsive";
import NavbarAccount from "./navbar/NavbarAccount";

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  isDashboard: boolean;
  horizontalLayout: string;
  isDesktop: boolean;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" &&
    prop !== "isOffset" &&
    prop !== "horizontalLayout" &&
    prop !== "isDashboard" &&
    prop !== "isDesktop",
})<RootStyleProps>(({ isCollapse, isOffset, horizontalLayout, isDashboard, theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(isDashboard && {
    width: "100%",
    minHeight: "70px",
    left: 0,
  }),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("lg")]: {
    boxShadow: "none",
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(horizontalLayout === "true" && {
      width: "100%",
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT + 20,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  onOpenSidebar: VoidFunction;
  isCollapse?: boolean;
  horizontalLayout?: boolean;
};

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  horizontalLayout = false,
}: Props) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !horizontalLayout;

  const isDesktop = useResponsive("up", "sm");

  return (
    <RootStyle
      isDashboard={false}
      isCollapse={isCollapse}
      isOffset={isOffset}
      horizontalLayout={`${horizontalLayout}`}
      isDesktop={isDesktop || true}
    >
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 },
        }}
      >
        {((isDesktop && horizontalLayout) || !isDesktop) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%", position: "relative" }}
          >
            {!isDesktop && (
              <IconButtonAnimate
                onClick={onOpenSidebar}
                sx={{ mr: 1, color: "text.primary", zIndex: 2000 }}
              >
                <MenuIcon />
              </IconButtonAnimate>
            )}
            <Logo isCollapse={false} isDesktop={isDesktop} />
            <NavbarAccount isShowAvatarOnly isCollapse={false} />
          </Stack>
        )}
      </Toolbar>
    </RootStyle>
  );
}
