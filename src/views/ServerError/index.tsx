import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import SeverErrorIllustration from "assets/icons/SeverErrorIllustration";
import icon from "assets/images/logo.png";
import { MotionContainer } from "components/Motions";
import { PageWithTitle } from "components/Page";
import { LABEL } from "constants/label";
import { motion } from "framer-motion";
import { TStyles } from "types/Styles";

const HeaderStyle = styled("header")(() => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: "100%",
  position: "absolute",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
}));

const ServerErrorView = () => {
  return (
    <PageWithTitle
      title="500 Server Error"
      alignItems="center"
      display="flex"
      flexGrow={1}
      pt={15}
      pb={10}
    >
      <Container>
        <HeaderStyle>
          <img src={icon} alt="logo" style={styles.img} />
        </HeaderStyle>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <motion.div>
              <Typography variant="h3" paragraph>
                {LABEL.SERVER_ERROR}
              </Typography>
            </motion.div>
            <Typography sx={{ color: "text.secondary" }}>
              {LABEL.SERVER_ERROR_DESCRIPTION}
            </Typography>

            <motion.div>
              <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>
            <Button size="large" variant="contained" onClick={() => (document.location.href = "/")}>
              {LABEL.HOME}
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </PageWithTitle>
  );
};

export default ServerErrorView;

const styles: TStyles<"img"> = {
  img: {
    marginTop: 32,
    height: "50px",
    width: "auto",
    objectFit: "contain",
    objectPosition: "center",
  },
};
