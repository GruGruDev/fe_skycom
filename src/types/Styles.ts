import { SxProps, Theme } from "@mui/material";

export type PaletteColor = "primary" | "secondary" | "info" | "success" | "warning" | "error";

export type LabelColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export type TStyles<T extends string> = {
  [key in T]: React.CSSProperties;
};

// const styles: TStyles<""> = {};

export type TSx<T extends string> = {
  [key in T]: SxProps<Theme>;
};

// const sx: TSx<"hello"> = () => {
//   return {
//     hello: { pl: 10 },
//   };
// };
