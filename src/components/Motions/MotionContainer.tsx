import { Box, BoxProps } from "@mui/material";
import { motion } from "framer-motion";
//

const varWrapEnter = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

// ----------------------------------------------------------------------

interface MotionContainerProps extends BoxProps {
  initial?: boolean | string;
  open?: boolean;
}

export function MotionContainer({ open, children, ...other }: MotionContainerProps) {
  return (
    <Box
      component={motion.div}
      initial={false}
      animate={open ? "animate" : "exit"}
      variants={varWrapEnter}
      {...other}
    >
      {children}
    </Box>
  );
}
