import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { alpha, styled } from "@mui/material/styles";
import { MHidden } from "components/MHidden";
import { COLLAPSE_WIDTH, SIDEBAR_WIDTH } from "constants/index";
import useSettings from "hooks/useSettings";

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: SIDEBAR_WIDTH,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: "48px !important",
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function DashboardNavbar({ onOpenSidebar }: DashboardNavbarProps) {
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";

  return (
    <MHidden width="lgUp">
      <RootStyle
        sx={{
          ...(isCollapse && {
            width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` },
          }),
        }}
      >
        <ToolbarStyle>
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: "text.primary" }}>
            <MenuIcon />
          </IconButton>
        </ToolbarStyle>
      </RootStyle>
    </MHidden>
  );
}
