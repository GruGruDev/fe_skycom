// Libraries
import CircularProgress from "@mui/material/CircularProgress";
import { FC } from "react";
import { TStyles } from "types/Styles";

// Types
interface LoadingType {
  size?: number | string;
  style?: React.CSSProperties;
  fixed?: boolean;
}

export const LoadingModal: FC<LoadingType> = (props) => {
  const { size, style, fixed } = props;
  return (
    <div style={{ ...styles.wrapper, ...style, position: fixed ? "fixed" : "absolute" }}>
      <CircularProgress size={size} />
    </div>
  );
};

const styles: TStyles<"wrapper"> = {
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    // backgroundColor: "transparent",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
  },
};
