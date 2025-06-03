import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import toast, { Renderable, ValueOrFunction } from "react-hot-toast";
import { PaletteColor } from "types/Styles";

export type VariantNotificationType = "info" | "success" | "warning" | "error" | "promise" | null;

export enum NOTIFICATION_TYPE {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  PROMISE = "promise",
}

export const showToast = (notification: {
  variant: VariantNotificationType;
  message: string;
  duration?: number;
  promise?: {
    promise: Promise<void>;
    loading: Renderable;
    success: ValueOrFunction<Renderable, any>;
    error: ValueOrFunction<Renderable, any>;
  };
}) => {
  switch (notification.variant) {
    case NOTIFICATION_TYPE.SUCCESS: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={<CheckCircleIcon />} color="success" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.ERROR: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={<ErrorIcon />} color="error" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.INFO: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={<InfoIcon />} color="info" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.WARNING: {
      toast(notification.message, {
        icon: <SnackbarIcon icon={<PriorityHighIcon />} color="warning" />,
        duration: notification.duration,
      });
      break;
    }
    case NOTIFICATION_TYPE.PROMISE: {
      notification.promise?.promise &&
        toast.promise(notification.promise?.promise, {
          loading: notification.promise?.loading,
          success: notification.promise?.success,
          error: notification.promise?.error,
        });
      break;
    }
    default:
      toast(notification.message, { duration: notification.duration });
      break;
  }
};

type SnackbarIconProps = {
  icon: JSX.Element | React.ReactNode;
  color: PaletteColor;
};

function SnackbarIcon({ icon, color }: SnackbarIconProps) {
  return (
    <Box
      component="span"
      sx={{
        width: 40,
        height: 40,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        justifyContent: "center",
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      {icon}
    </Box>
  );
}

//--- services

export const showSuccess = (message?: string, duration?: number) => {
  message && showToast({ message, variant: "success", duration });
};
export const showError = (message?: string, duration?: number) => {
  message && showToast({ message, variant: "error", duration });
};
export const showWarning = (message?: string, duration?: number) => {
  message && showToast({ message, variant: "warning", duration });
};
export const showInfo = (message?: string, duration?: number) => {
  message && showToast({ message, variant: "info", duration });
};
