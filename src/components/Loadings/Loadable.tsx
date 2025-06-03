import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import Box from "@mui/material/Box";

export const Loadable = (Component: any) => (props: any) => {
  // eslint-disable-next-line
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("/dashboard");

  return (
    <Suspense
      fallback={
        <Box height={"calc(100vh - 100px)"}>
          <LoadingScreen
            sx={{
              ...(!isDashboard && {
                top: 0,
                left: 0,
                width: 1,
                zIndex: 1,
                position: "fixed",
              }),
            }}
          />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};
