import { LABEL } from "constants/label";
import { AuthContext } from "providers/Auth";
import { useContext } from "react";
import { showError } from "utils/toast";

// ----------------------------------------------------------------------

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    showError(LABEL.ERROR_CONNECT_DATA);
    throw new Error("Auth context must be use inside AuthProvider");
  }

  return context;
};

export default useAuth;
