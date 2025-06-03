import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
export interface MButtonProps extends ButtonProps {
  loading?: boolean;
}

export const MButton = (props: MButtonProps) => {
  const {
    fullWidth = false,
    color = "primary",
    disabled = false,
    size,
    variant = "contained",
    loading = false,
    ...buttonProps
  } = props;

  return (
    <Button
      color={color}
      variant={variant}
      disabled={loading || disabled}
      size={size}
      fullWidth={fullWidth}
      {...buttonProps}
    >
      {loading && <CircularProgress size={20} style={styles.loadingIcon} />}
      {props.children}
    </Button>
  );
};

const styles = {
  loadingIcon: { marginRight: 8 },
};
