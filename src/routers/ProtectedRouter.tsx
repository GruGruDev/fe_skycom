import { LoadingScreen } from "components/Loadings";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TUser } from "types/User";
import { deleteAllStorages } from "utils/asyncStorage";
import { showWarning } from "utils/toast";
import NotHaveAccess from "views/NotHaveAccess";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: JSX.Element | null;
  hasPermission?: boolean;
  user: Partial<TUser> | null;
};

export default function ProtectedRouter({ children, hasPermission, user }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user?.is_superuser) {
      return;
    }

    if (!user?.role?.default_router) {
      showWarning(VALIDATION_MESSAGE.REQUIRE_DEFAULT_ROUTE);

      deleteAllStorages();
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? (
    hasPermission || user.is_superuser ? (
      children
    ) : (
      <NotHaveAccess />
    )
  ) : (
    <Box height={"calc(100vh - 100px)"}>
      <LoadingScreen />
    </Box>
  );
}
