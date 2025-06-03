import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

export const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
    direction?: "up" | "down" | "left" | "right";
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction={props.direction || "up"} ref={ref} {...props} />;
});
