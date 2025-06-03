import { AuthProvider } from "providers/Auth";
import ThemePrimaryColor from "providers/ThemeColor";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Router from "routers";
import { store } from "store";
import ThemeConfig from "theme";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/plugin/utc";

import { SettingsProvider } from "providers/Settings";
import { Toaster } from "react-hot-toast";
import { TStyles } from "types/Styles";
("use client");

import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import ServerErrorView from "views/ServerError";

function App() {
  function fallbackRender({ error }: FallbackProps) {
    console.log("🚀 ~ fallbackRender ~ error:", error);
    return <ServerErrorView />;
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <SettingsProvider>
        <ThemeConfig>
          <ThemePrimaryColor>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ReduxProvider store={store}>
                <AuthProvider>
                  <BrowserRouter>
                    <Router />
                    <Toaster toastOptions={{ style: styles.toast }} position="top-right" />
                  </BrowserRouter>
                </AuthProvider>
              </ReduxProvider>
            </LocalizationProvider>
          </ThemePrimaryColor>
        </ThemeConfig>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;

const styles: TStyles<"toast"> = {
  toast: { fontSize: "0.82rem" },
};
