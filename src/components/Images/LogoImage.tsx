import Box from "@mui/material/Box";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import lightLogo from "assets/images/dark_logo.svg";
import darkLogo from "assets/images/white_logo.svg";
import icon from "assets/images/logo.png";
import { TStyles } from "types/Styles";
import { Link } from "react-router-dom";
// ----------------------------------------------------------------------

export function Logo({
  sx,
  isCollapse = true,
  isDesktop,
}: {
  sx?: SxProps<Theme>;
  isCollapse?: boolean;
  isDesktop?: boolean;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "fit-content",
        height: "50px",
        position: "relative",
        margin: "0 auto",
        ...sx,
      }}
    >
      <Link to="/dashboard">
        <img
          src={
            isCollapse || !isDesktop ? icon : theme.palette.mode === "light" ? lightLogo : darkLogo
          }
          alt="logo"
          style={styles.img}
        />
      </Link>
    </Box>
  );
}

const styles: TStyles<"img"> = {
  img: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    objectPosition: "center",
  },
};
