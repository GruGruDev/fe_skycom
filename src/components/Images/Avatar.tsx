import { AvatarProps } from "@mui/material";
import MUIAvatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import useAuth from "hooks/useAuth";
import { forwardRef } from "react";
import { PaletteColor } from "types/Styles";
import createAvatar from "utils/avatar";

import DEFAULT_AVATAR from "assets/images/avatar_default.jpg";

// ----------------------------------------------------------------------

export interface Props extends AvatarProps {
  color?: PaletteColor;
}

export function MyAvatar({ ...other }: Props) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.images?.[0]?.image || DEFAULT_AVATAR}
      alt={user?.name}
      color={createAvatar(user?.name).color}
      {...other}
    >
      {createAvatar(user?.name).name}
    </Avatar>
  );
}

// ----------------------------------------------------------------------

const Avatar = forwardRef<HTMLDivElement, Props>(
  ({ color = "info", children, sx, ...other }, ref) => {
    const theme = useTheme();

    if (color === "info") {
      return (
        <MUIAvatar ref={ref} sx={sx} {...other}>
          {children}
        </MUIAvatar>
      );
    }

    return (
      <MUIAvatar
        ref={ref}
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
          ...sx,
        }}
        {...other}
      >
        {children}
      </MUIAvatar>
    );
  },
);
