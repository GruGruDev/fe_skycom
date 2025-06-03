import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Avatar(theme: Theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.grey[400],
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        avatar: {
          fontSize: "1rem",
          fontWeight: theme.typography.fontWeightMedium,
          "&:first-of-type": {
            fontSize: "0.82rem",
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.lighter,
          },
        },
      },
    },
  };
}
