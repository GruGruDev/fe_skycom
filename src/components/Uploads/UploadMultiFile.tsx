import Grid from "@mui/material/Grid";
import FormHelperText from "@mui/material/FormHelperText";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import { BlockContent } from "./BlockContent";
import { MultiFilePreview } from "./MultiFilePreview";
import { RejectionFiles } from "./RejectionFiles";
import { UploadMultiFileProps } from "./type";
import { TStyles } from "types/Styles";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  padding: [1, 2, 3, 4, 5],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ----------------------------------------------------------------------

export function UploadMultiFile({
  error,
  showPreview = false,
  loading = false,
  isMultiple = true,
  files,
  children,
  showResult = true,
  style,
  onRemove,
  onRemoveAll,
  onSetDefault,
  ...other
}: UploadMultiFileProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: isMultiple,
    ...other,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        {loading && <LinearProgress />}
        <DropZoneStyle
          {...getRootProps()}
          onClick={(e) => {
            getRootProps().onClick?.(e);
            e.stopPropagation();
            e.preventDefault();
          }}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: "error.main",
              borderColor: "error.light",
              bgcolor: "error.lighter",
            }),
            position: "relative",
          }}
          style={style}
        >
          <input {...getInputProps()} />

          {children ? children : <BlockContent />}
        </DropZoneStyle>
      </Grid>

      {showResult && (
        <Grid item xs={12} md={6}>
          {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
          <MultiFilePreview
            files={files}
            showPreview={showPreview}
            onRemove={onRemove}
            onRemoveAll={onRemoveAll}
            onClickUpload={getRootProps().onClick}
            onSetDefault={onSetDefault}
          />
        </Grid>
      )}

      {error && (
        <FormHelperText error style={styles.helperText}>
          {error?.message}
        </FormHelperText>
      )}
    </Grid>
  );
}

const styles: TStyles<"helperText"> = {
  helperText: { paddingLeft: 16, paddingRight: 16 },
};
