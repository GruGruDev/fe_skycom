import { styled, SxProps, Theme } from "@mui/material";
import Paper from "@mui/material/Paper";
import React from "react";

export const WrapPage = ({
  children,
  sx,
  style,
  outlined = true,
}: {
  children: React.ReactNode | JSX.Element;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  outlined?: boolean;
}) => {
  return (
    <StylePaper variant={outlined ? "outlined" : undefined} className="hello" sx={sx} style={style}>
      {children}
    </StylePaper>
  );
};

const StylePaper = styled(Paper)(({ theme }) => ({
  // marginTop: 24,
  // marginBottom: 24,
  padding: [0, 8],
  "& .Pagination-text*": {
    color: `${theme.palette.text.primary} !important`,
    minWidth: "16px !important",
  },
}));
