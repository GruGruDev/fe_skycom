import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { showWarning } from "./toast";
import { deleteAllStorages } from "./asyncStorage";

export const resetStorage = () => {
  showWarning(RESPONSE_MESSAGES.END_SESSION);
  deleteAllStorages();
  sessionStorage.clear();
  // deleteStorage("access-token");
  // deleteStorage("refresh-token");
  //   redirectTo(document, "/login");
};
