import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Theme, styled, useTheme } from "@mui/material/styles";
import { ProgressBarStyle } from "components/Loadings";
import { PageWithTitle } from "components/Page";
import { ScrollToTop } from "components/Scrolls";
import { Settings } from "components/Setting";
import { BOTTOM_PAGE_HEIGHT, COLLAPSE_WIDTH, DRAWER_WIDTH, HEADER } from "constants/index";
import { LABEL } from "constants/label";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import GlobalStyles from "theme/globalStyles";
import { ThemeLayout } from "types/Setting";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./Header";
import NavbarHorizontal from "./navbar/NavbarHorizontal";

const RootStyle = styled("div")({
  display: "flex",
  minHeight: `calc(100vh - ${BOTTOM_PAGE_HEIGHT}px)`,
  overflow: "hidden",
  backgroundSize: "contain",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up("lg")]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettings();
  const theme = useTheme();
  const isDesktop = useResponsive("up", "sm");
  const [open, setOpen] = useState(false);

  const isHorizontalLayout = themeLayout === "horizontal";
  const isCollapse = themeLayout === "vertical_collapsed";

  const horizontalLayout = (
    <>
      <DashboardHeader onOpenSidebar={() => setOpen(true)} horizontalLayout={true} />

      {isDesktop ? (
        <NavbarHorizontal />
      ) : (
        <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      )}

      <Box
        component="main"
        sx={{
          pt: {
            xs: `${HEADER.MOBILE_HEIGHT}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 100}px`,
          },
          px: [1, 2],
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </>
  );

  const verticalLayout = (
    <RootStyle>
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle
        sx={{
          transition: theme.transitions.create("margin", {
            duration: "0.75s",
            easing: theme.transitions.easing.easeInOut,
          }),
          marginTop: { xs: 7, lg: 0 },
          ...(themeLayout === "vertical" && {
            ml: `${DRAWER_WIDTH}px`,
          }),
          ...(themeLayout === "vertical_collapsed" && {
            ml: `${COLLAPSE_WIDTH + 16}px`,
          }),
          [theme.breakpoints.down("lg")]: {
            ml: "0px",
          },
        }}
      >
        {!isDesktop ? (
          <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />
        ) : (
          <></>
        )}
        <PageWithTitle p={[1, 2]} title={LABEL.HOME}>
          <Outlet />
        </PageWithTitle>
      </MainStyle>
    </RootStyle>
  );

  const refreshToken = localStorage.getItem("refresh-token");

  if (!refreshToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <GlobalStyles />
      <ProgressBarStyle />
      <Settings />
      <ScrollToTop />
      {isHorizontalLayout ? horizontalLayout : verticalLayout}
      {isDesktop && (
        <Footer themeLayout={themeLayout} theme={theme}>
          Developed by <b>Tam Luxury</b>
        </Footer>
      )}
    </>
  );
}

type FooterProps = {
  theme: Theme;
  themeLayout: ThemeLayout;
};

const Footer = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "themeLayout" && prop !== "theme",
})<FooterProps>(({ theme, themeLayout }) => ({
  textAlign: "center",
  fontSize: "0.82rem",
  fontWeight: "400",
  padding: "12px 0",
  backgroundColor: theme.palette.background.default,
  boxShadow: `0px 2px 4px -1px rgb(145 158 171 / 20%), 0px 4px 5px 0px rgb(145 158 171 / 14%), 0px 1px 10px 0px rgb(145 158 171 / 12%)`,
  width:
    themeLayout === "vertical_collapsed"
      ? `calc(100% - ${COLLAPSE_WIDTH}px)`
      : themeLayout === "vertical"
        ? `calc(100% - ${DRAWER_WIDTH}px)`
        : 0,
  marginLeft:
    themeLayout === "vertical_collapsed"
      ? COLLAPSE_WIDTH
      : themeLayout === "vertical"
        ? DRAWER_WIDTH
        : 0,
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    marginLeft: 0,
  },
}));
