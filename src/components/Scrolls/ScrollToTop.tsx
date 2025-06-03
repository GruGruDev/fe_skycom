import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { TStyles } from "types/Styles";
// ----------------------------------------------------------------------

export function ScrollToTop() {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get the button
  let mybutton = document.getElementById("scroll-top-button");

  // When the user scrolls down 20px from the top of the document, show the button
  window.addEventListener("scroll", () => {
    scrollFunction();
  });

  function scrollFunction() {
    if (mybutton) {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return isMobile ? (
    <ArrowCircleUpIcon
      color="primary"
      style={styles.scrollTopButton}
      id="scroll-top-button"
      fontSize="large"
      onClick={topFunction}
    />
  ) : null;
}

const styles: TStyles<"scrollTopButton"> = {
  scrollTopButton: {
    display: "none",
    position: "fixed",
    bottom: "20px",
    right: "30px",
    zIndex: 99,
  },
};
