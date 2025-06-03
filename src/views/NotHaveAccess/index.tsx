import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import NotPermission from "assets/icons/NotPermission";
import { MotionContainer } from "components/Motions";
import { LABEL } from "constants/label";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const NotHaveAccess = () => {
  return (
    <Box width="100%" height="100%" display={"flex"} justifyContent="center" alignItems="center">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <motion.div>
              <Typography variant="h3" paragraph>
                {LABEL.NOT_PROTECTED}
              </Typography>
            </motion.div>
            <Typography sx={{ color: "text.secondary" }}>{LABEL.CONTACT_ADMIN}</Typography>

            <motion.div>
              <NotPermission />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              {LABEL.HOME}
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </Box>
  );
};

export default NotHaveAccess;
