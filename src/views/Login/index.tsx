import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginLogo from "assets/images/illustration_login.png";
import { LoadingScreen } from "components/Loadings";
import { MHidden } from "components/MHidden";
import { PageWithTitle } from "components/Page";
import { LABEL } from "constants/label";
import useAuth from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";

// ----------------------------------------------------------------------

const RootStyle = styled(PageWithTitle)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

const BackgroundStyle = styled("div")(() => ({
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  // minWidth: "100vh",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  WebkitFilter: "blur(12px)" /* Safari 6.0 - 9.0 */,
  filter: "blur(12px)",
  opacity: 0.6,
}));

// ----------------------------------------------------------------------

export default function LoginView() {
  const refreshToken = localStorage.getItem("refresh-token");
  const { user } = useAuth();

  if (refreshToken) {
    return user ? (
      user.role?.default_router ? (
        <Navigate to={user.role.default_router} replace />
      ) : (
        <Navigate to={"/"} replace />
      )
    ) : (
      <LoadingScreen />
    );
  }

  return (
    <RootStyle title={LABEL.LOGIN}>
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            {`${LABEL.WELCOME}`}
          </Typography>
          <img src={LoginLogo} alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <MHidden width="mdUp">
          <BackgroundStyle>
            <img src={LoginLogo} alt="login" />
          </BackgroundStyle>
        </MHidden>
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                {LABEL.LOGIN_TO_SKYCOM}
              </Typography>
            </Box>
          </Stack>

          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
