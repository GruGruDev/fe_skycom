import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import RotateLeft from "@mui/icons-material/RotateLeft";
import RotateRight from "@mui/icons-material/RotateRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { SxProps, Theme, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import defaultImage from "assets/images/logo.jpeg";
import { ZINDEX_SYSTEM } from "constants/index";
import React from "react";
import { TStyles } from "types/Styles";
import EditIcon from "@mui/icons-material/Edit";
import { UploadMultiFile } from "components/Uploads";
import { fileApi } from "apis/file";
import LinearProgress from "@mui/material/LinearProgress";
import { TImage, TImageDTO } from "types/Media";
import { showError, showSuccess } from "utils/toast";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";

export interface PreviewImageProps {
  id?: string;
  src?: string;
  preview?: boolean;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  contentImage?: JSX.Element;
  onDelete?: ({ id, src }: { id: string; src: string }) => void;
  onAddImage?: (image: TImage) => void;
  wrapImgSx?: SxProps<Theme>;
  params?: Omit<TImageDTO, "image">;
}

export const PreviewImage = ({
  id,
  src,
  preview,
  width = "100%",
  height = "100%",
  style,
  contentImage,
  onDelete,
  onAddImage,
  wrapImgSx,
  params,
}: PreviewImageProps) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [effect, setEffect] = React.useState({ rotate: 0, scale: 1 });

  const theme = useTheme();

  const handleClickOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setOpen(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleClose = (e: any) => {
    setOpen(false);
    e?.stopPropagation();
  };

  window.onscroll = (e) => {
    return e;
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    if (params) {
      setLoading(true);

      const res = await fileApi.uploadImage({
        endpoint: "images/",
        params: { ...params, image: acceptedFiles[0] },
      });
      setLoading(false);

      if (res) {
        onAddImage?.(res.data);
        showSuccess(RESPONSE_MESSAGES.UPLOAD_SUCCESS);
      } else {
        showError(RESPONSE_MESSAGES.UPLOAD_ERROR);
      }
    }
  };

  return (
    <>
      {preview && (
        <Dialog
          onClose={handleClose}
          open={open}
          sx={{
            ".MuiPaper-root": {
              overflow: "unset",
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            zIndex: `${ZINDEX_SYSTEM.selector} !important`,
          }}
        >
          {open && (
            <div style={styles.groupButton}>
              <IconButton
                onClick={(e) => {
                  setEffect((prev) => ({ ...prev, rotate: prev.rotate - 90 }));
                  e.stopPropagation();
                }}
              >
                <RotateLeft />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  setEffect((prev) => ({ ...prev, rotate: prev.rotate + 90 }));
                  e.stopPropagation();
                }}
              >
                <RotateRight />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  setEffect((prev) => ({ ...prev, scale: prev.scale + 0.2 }));
                  e.stopPropagation();
                }}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  setEffect((prev) => ({
                    ...prev,
                    scale: prev.scale <= 1 ? 1 : prev.scale - 0.2,
                  }));
                  e.stopPropagation();
                }}
              >
                <ZoomOutIcon />
              </IconButton>
            </div>
          )}
          <DialogContent
            sx={{
              borderRadius: "0px !important",
              transform: `rotate(${effect.rotate}deg) scale(${effect.scale})`,
              padding: 0,
            }}
          >
            {src ? <img loading="lazy" src={src} style={{ scale: effect.scale }} alt="" /> : null}
          </DialogContent>
        </Dialog>
      )}
      <Stack className="relative mimg" style={styles.wrapImg} sx={{ width, ...wrapImgSx }}>
        {/* {onEdit && ( */}
        {loading && <LinearProgress />}
        <Stack position={"absolute"} top={0} right={0} direction={"row"} spacing={0.5}>
          {onAddImage && (
            <Stack zIndex={1}>
              <UploadMultiFile showResult={false} onDrop={handleDrop} style={styles.uploadWrapper}>
                <EditIcon color="secondary" style={styles.doDisturnOnIcon} />
              </UploadMultiFile>
            </Stack>
          )}
          {/* )} */}
          {onDelete && src && (
            <DoDisturbOnIcon
              onClick={() => id && onDelete && onDelete({ id, src })}
              style={styles.doDisturnOnIcon}
              sx={{ color: "error.main" }}
              fontSize="small"
            />
          )}
        </Stack>

        {contentImage ? (
          <Box onClick={handleClickOpen} style={styles.contentImg}>
            {contentImage}
          </Box>
        ) : src ? (
          <img
            style={{
              ...styles.img,
              cursor: preview ? "pointer" : "unset",
              boxShadow: `6px 6px 6px -4px ${theme.palette.grey[600]}`,
              height,
              width,
              ...style,
            }}
            src={src}
            onClick={handleClickOpen}
            alt=""
          />
        ) : (
          <img src={defaultImage} style={{ ...styles.imgFilter, width, height, ...styles.img }} />
        )}
      </Stack>
    </>
  );
};

const styles: TStyles<
  | "groupButton"
  | "wrapImg"
  | "doDisturnOnIcon"
  | "uploadWrapper"
  | "img"
  | "contentImg"
  | "imgFilter"
> = {
  groupButton: { position: "fixed", top: 10, right: 10, zIndex: 9999 },
  wrapImg: { position: "relative", display: "flex", flexShrink: 0 },
  doDisturnOnIcon: {
    cursor: "pointer",
    fontSize: "1rem",
  },
  uploadWrapper: {
    padding: 0,
    backgroundColor: "unset",
    border: "unset",
  },
  img: { borderRadius: 8, minWidth: 30, minHeight: 30, objectFit: "cover" },
  contentImg: { cursor: "pointer" },
  imgFilter: { filter: "grayscale(100%)" },
};
