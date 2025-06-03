import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Variant } from "@mui/material/styles/createTypography";
import { OverridableStringUnion } from "@mui/types";
import { MButton } from "components/Buttons";
import { SlideTransition } from "components/SlideTransition";
import { BUTTON } from "constants/button";
import React, { memo } from "react";
import { TGridSize } from "types/GridLayout";
import { TStyles } from "types/Styles";

// -------------------------------------------------------

const idContentFormModal = "wrap-content-dialog";
export interface FormDialogProps {
  title?: string;
  sizeTitle?: OverridableStringUnion<"inherit" | Variant, object>;
  open: boolean;
  buttonText?: string;
  buttonCloseText?: string;
  isShowFooter?: boolean;
  loading?: boolean;
  disabledSubmit?: boolean;
  isEnterToSubmit?: boolean;
  zIndex?: number;
  children?: React.ReactNode;
  maxWidth?: TGridSize;
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClose?: () => void;
  onButtonClose?: () => void;
  sx?: SxProps<Theme>;
  fullScreen?: boolean;
  transition?: boolean;
  enableCloseByDropClick?: boolean;
  contentStyle?: React.CSSProperties;
}

export const FormDialog = memo(
  ({
    fullScreen,
    buttonCloseText = BUTTON.CLOSE,
    buttonText = BUTTON.SAVE,
    children,
    loading = false,
    isEnterToSubmit = true,
    isShowFooter = true,
    zIndex = 1200,
    maxWidth,
    onClose,
    onButtonClose,
    onSubmit,
    disabledSubmit,
    open,
    title,
    sizeTitle = "h4",
    transition,
    sx,
    enableCloseByDropClick,
    contentStyle,
  }: FormDialogProps) => {
    const onBottomClose = onButtonClose || onClose;
    return (
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth
        onClose={(_e, reason) => {
          if (reason === "backdropClick" && !enableCloseByDropClick) {
            return;
          }
          onClose?.();
        }}
        disableEscapeKeyDown
        fullScreen={fullScreen}
        TransitionComponent={transition ? SlideTransition : undefined}
        style={{ zIndex }}
        sx={{ ".MuiPaper-root": { m: 0 }, ...sx }}
      >
        {title && (
          <>
            <DialogTitle style={headerDialogStyle}>
              <DialogHeader>
                <Typography variant={sizeTitle} sx={{ fontSize: "1.1rem !important" }}>
                  {title}
                </Typography>
                {onClose && <CloseIconWrap onClick={onClose} />}
              </DialogHeader>
            </DialogTitle>
            <Divider />
          </>
        )}
        {loading && <LinearProgress />}

        <DialogContent
          id={idContentFormModal}
          sx={{ paddingX: [1, 2, 3], py: [2, 3] }}
          style={contentStyle}
        >
          {isEnterToSubmit ? (
            <Box component="form" onSubmit={onSubmit as any}>
              {children}
            </Box>
          ) : (
            children
          )}
        </DialogContent>

        <Divider />

        {isShowFooter ? (
          <DialogBottom style={footerDialogStyle}>
            {onBottomClose && (
              <MButton
                variant="outlined"
                onClick={onBottomClose}
                color="inherit"
                style={styles.cancelButton}
              >
                {buttonCloseText}
              </MButton>
            )}
            {onSubmit && (
              <Stack direction="row" alignItems="center">
                <LoadingButton
                  variant="contained"
                  onClick={onSubmit}
                  disabled={loading || disabledSubmit}
                  loading={loading}
                >
                  {buttonText}
                </LoadingButton>
              </Stack>
            )}
          </DialogBottom>
        ) : null}
      </Dialog>
    );
  },
);

const CloseIconWrap = styled(CloseIcon)({
  fontSize: "1.6rem",
  color: "#595959",
  cursor: "pointer",
});

const DialogHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

const DialogBottom = styled(DialogActions)({
  marginRight: 25,
});

const footerDialogStyle = { padding: "20px 0px" };
const headerDialogStyle = { paddingBottom: 8 };

const styles: TStyles<"cancelButton" | "submitButton"> = {
  cancelButton: { marginRight: 8 },
  submitButton: { marginLeft: 8 },
};
