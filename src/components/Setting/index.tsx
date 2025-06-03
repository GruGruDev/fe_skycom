import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Backdrop } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, styled, Theme } from "@mui/material/styles";
import { IconButtonAnimate } from "components/Buttons";
import { NAVBAR } from "constants/index";
import { AnimatePresence, m } from "framer-motion";
import useSettings from "hooks/useSettings";
import { useEffect } from "react";
import { SettingColor } from "./SettingColor";
import { SettingDirection } from "./SettingDirection";
import { SettingFullscreen } from "./SettingFullscreen";
import { SettingLayout } from "./SettingLayout";
import { SettingMode } from "./SettingMode";
import { SettingStretch } from "./SettingStretch";
import { SettingTableLayout } from "./SettingTableLayout";

const CLOSE_ICON_SIZE = 20;

// ----------------------------------------------------------------------

type BackgroundBlurProps = {
  blur?: number;
  opacity?: number;
  color?: string;
};

type BackgroundGradientProps = {
  direction?: string;
  startColor?: string;
  endColor?: string;
};

function getDirection(value = "bottom") {
  return {
    top: "to top",
    right: "to right",
    bottom: "to bottom",
    left: "to left",
  }[value];
}

// ----------------------------------------------------------------------

export default function cssStyles(theme?: Theme) {
  return {
    bgBlur: (props?: BackgroundBlurProps) => {
      const color = props?.color || theme?.palette.background.default || "#000000";

      const blur = props?.blur || 6;
      const opacity = props?.opacity || 0.8;

      return {
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`, // Fix on Mobile
        backgroundColor: alpha(color, opacity),
      };
    },
    bgGradient: (props?: BackgroundGradientProps) => {
      const direction = getDirection(props?.direction);
      const startColor = props?.startColor || `${alpha("#000000", 0)} 0%`;
      const endColor = props?.endColor || "#000000 75%";

      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor});`,
      };
    },
  };
}

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
  top: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  position: "fixed",
  overflow: "hidden",
  width: NAVBAR.BASE_WIDTH,
  flexDirection: "column",
  margin: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 3,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === "light" ? theme.palette.grey[500] : theme.palette.common.black,
    0.16,
  )}`,
}));

// ----------------------------------------------------------------------

export function Settings() {
  const { onResetSetting, isOpenModal, onShowModal } = useSettings();

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpenModal]);

  const handleClose = () => {
    onShowModal(false);
  };

  return (
    <>
      <Backdrop
        open={isOpenModal}
        onClick={handleClose}
        sx={{ background: "transparent", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />
      <AnimatePresence>
        {isOpenModal && (
          <>
            <RootStyle>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 2, pr: 1, pl: 2.5 }}
              >
                <Typography variant="subtitle1">Settings</Typography>
                <div>
                  <IconButtonAnimate onClick={onResetSetting}>
                    <RefreshIcon style={{ fontSize: CLOSE_ICON_SIZE }} />
                  </IconButtonAnimate>
                  <IconButtonAnimate onClick={handleClose}>
                    <CloseIcon style={{ fontSize: CLOSE_ICON_SIZE }} />
                  </IconButtonAnimate>
                </div>
              </Stack>

              <Divider sx={{ borderStyle: "dashed" }} />

              <>
                <Stack spacing={3} sx={{ p: 3, overflow: "auto" }}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Mode</Typography>
                    <SettingMode />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Direction</Typography>
                    <SettingDirection />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Layout</Typography>
                    <SettingLayout />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Presets</Typography>
                    <SettingColor />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Table Layout</Typography>
                    <SettingTableLayout />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Stretch</Typography>
                    <SettingStretch />
                  </Stack>

                  <SettingFullscreen />
                </Stack>
              </>
            </RootStyle>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ----------------------------------------------------------------------

type Props = {
  value: string;
};

export function BoxMask({ value }: Props) {
  return (
    <FormControlLabel
      label=""
      value={value}
      control={<Radio sx={{ display: "none" }} />}
      sx={{
        m: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: "absolute",
      }}
    />
  );
}
