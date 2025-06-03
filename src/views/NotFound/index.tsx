import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { PageWithTitle } from "components/Page";
import PageNotFoundIllustration from "assets/icons/PageNotFoundIllustration";
import { MotionContainer } from "components/Motions";
import { LABEL } from "constants/label";

const NotFoundView = () => {
  return (
    <PageWithTitle
      title="404 Page Not Found"
      alignItems="center"
      display="flex"
      flexGrow={1}
      pt={15}
      pb={10}
    >
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <motion.div>
              <Typography variant="h3" paragraph>
                {LABEL.NOT_FOUND}
              </Typography>
            </motion.div>
            <Typography sx={{ color: "text.secondary" }}>{LABEL.NOT_FOUND_PAGE_URL}</Typography>

            <motion.div>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              {LABEL.HOME}
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </PageWithTitle>
  );
};

export default NotFoundView;
