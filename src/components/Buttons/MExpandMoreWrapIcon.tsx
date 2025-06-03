import { SxProps, Theme, styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { forwardRef } from "react";
import { PaletteColor } from "types/Styles";

export interface ExpandMoreProps extends IconButtonProps {
  expand: "false" | "true";
  color?: PaletteColor;
  buttonSx?: SxProps<Theme>;
}

const MExpandMoreWrapIcon = styled(
  forwardRef((props: ExpandMoreProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { buttonSx, ...other } = props;
    return <IconButton {...other} sx={{ ...buttonSx }} ref={ref} />;
  }),
)(({ theme, expand }) => ({
  transform: expand === "false" ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const MExpandMoreIconButton = forwardRef(
  (props: ExpandMoreProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { color = "primary.main" } = props;

    return (
      <MExpandMoreWrapIcon {...props} ref={ref}>
        <ExpandMoreIcon sx={{ color }} />
      </MExpandMoreWrapIcon>
    );
  },
);
