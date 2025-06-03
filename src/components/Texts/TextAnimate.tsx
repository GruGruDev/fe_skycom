import { motion, MotionProps } from "framer-motion";
// material
import { BoxProps } from "@mui/material";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

type Props = BoxProps & MotionProps;

interface AnimationTextProps extends Props {
  text: string;
}

export function AnimationText({ text, variants, sx, ...other }: AnimationTextProps) {
  return (
    <Box
      component={motion.h1}
      sx={{
        typography: "h1",
        overflow: "hidden",
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      {text.split("").map((letter, index) => (
        <motion.span key={index} variants={variants}>
          {letter}
        </motion.span>
      ))}
    </Box>
  );
}
