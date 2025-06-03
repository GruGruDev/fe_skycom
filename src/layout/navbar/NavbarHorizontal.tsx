import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HEADER } from "constants/index";
import useSettings from "hooks/useSettings";
import { NavSectionHorizontal } from "layout/Sections";
import SidebarConfig from "layout/SidebarConfig";
import { memo } from "react";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  transition: theme.transitions.create("top", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: "100%",
  position: "fixed",
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT + 20,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

function NavbarHorizontal() {
  const { onShowModal, isOpenModal } = useSettings();

  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal
          navConfig={SidebarConfig({
            handleShowThemeModal: () => onShowModal(!isOpenModal),
          })}
        />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
