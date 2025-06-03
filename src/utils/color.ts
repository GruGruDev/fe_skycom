import { orange } from "@mui/material/colors";

export const getTopHighlightColor = (position: number) => {
  switch (position) {
    case 0:
      return orange[700];
    case 1:
      return orange[500];
    case 2:
      return orange[300];

    default:
      return "";
  }
};
