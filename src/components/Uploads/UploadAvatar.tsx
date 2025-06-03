import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PreviewImage } from "components/Images";
import { LoadingModal } from "components/Loadings";
import { useDropzone } from "react-dropzone";
import { RejectionFiles } from "./RejectionFiles";
import { UploadProps } from "./type";
import { LABEL } from "constants/label";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  width: 144,
  height: 144,
  margin: "auto",
  borderRadius: "50%",
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  position: "relative",
}));

const DropZoneStyle = styled("div")({
  zIndex: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  display: "flex",
  overflow: "hidden",
  borderRadius: "50%",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  "& > *": { width: "100%", height: "100%" },
  "&:hover": {
    cursor: "pointer",
    "& .placeholder": {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled("div")(({ theme }) => ({
  display: "flex",
  position: "absolute",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

export function UploadAvatar({ error, file, helperText, sx, loading, ...other }: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <>
      <RootStyle
        sx={{
          ...((isDragReject || error) && {
            borderColor: "error.light",
          }),
          ...sx,
        }}
      >
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
          }}
        >
          <input {...getInputProps()} />

          {file && <PreviewImage src={typeof file === "string" ? file : file.url} />}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: "common.white",
                bgcolor: "grey.900",
                "&:hover": { opacity: 0.72 },
              }),
              ...((isDragReject || error) && {
                bgcolor: "error.lighter",
              }),
            }}
          >
            <AddAPhotoIcon sx={{ width: 24, height: 24, mb: 1 }} />
            <Typography variant="caption">{LABEL.SELECT_IMAGE}</Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
        {loading && <LoadingModal />}
      </RootStyle>

      {helperText && helperText}
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
    </>
  );
}
