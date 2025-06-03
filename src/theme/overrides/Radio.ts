import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Radio(theme?: Theme) {
  return {
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme?.spacing(1),
          svg: {
            fontSize: "1.6rem",
            "&[font-size=small]": {
              fontSize: "1.5rem",
            },
          },
        },
      },
    },
  };
}
