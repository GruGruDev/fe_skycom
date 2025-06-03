import { SettingsContext } from "providers/Settings";
import { useContext } from "react";

// ----------------------------------------------------------------------

const useSettings = () => useContext(SettingsContext);

export default useSettings;
