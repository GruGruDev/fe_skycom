import { Box, Button, Divider, SxProps, Theme, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MyAvatar } from "components/Images";
import { MPopover } from "components/Popovers";
import { LABEL } from "constants/label";
import { ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { showError } from "utils/toast";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
  cursor: "pointer",
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
  isShowAvatarOnly?: boolean;
  containerSx?: SxProps<Theme>;
};

export default function NavbarAccount({
  isCollapse,
  isShowAvatarOnly = false,
  containerSx,
}: Props) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCollapse) {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }
    }

    prevOpen.current = open;
  }, [isCollapse, open]);

  const handleClose = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await logout?.();
      navigate("/");
      handleClose(event);
    } catch (error) {
      showError(LABEL.CANNOT_LOGOUT);
    }
  };

  return (
    <>
      <RootStyle
        sx={{
          position: "relative",
          ...((isCollapse || isShowAvatarOnly) && {
            bgcolor: "transparent",
          }),
          ...containerSx,
        }}
        onClick={() => navigate(`/${ROLE_TAB.PROFILE}`)}
        ref={anchorRef as any}
      >
        <MyAvatar />

        {!isShowAvatarOnly && (
          <>
            <Box
              sx={{
                ml: 2,
                transition: (theme) =>
                  theme.transitions.create("width", {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && {
                  ml: 0,
                  width: 0,
                }),
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {user?.name}
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
                {user?.email}
              </Typography>
            </Box>
          </>
        )}
      </RootStyle>

      <MPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 240 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={(e: any) => handleLogout(e)}
          >
            Logout
          </Button>
        </Box>
      </MPopover>
    </>
  );
}
