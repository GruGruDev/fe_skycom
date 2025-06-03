import { forwardRef, ReactNode, useEffect } from "react";
// material
import { BoxProps } from "@mui/material";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
}

export const PageWithTitle = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...other }, ref) => {
    const convertToLowerCase = (text: string) => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    useEffect(() => {
      document.title = convertToLowerCase(title);
    }, [title]);

    return (
      <>
        <Box ref={ref} {...other} sx={other.sx}>
          {children}
        </Box>
      </>
    );
  },
);
