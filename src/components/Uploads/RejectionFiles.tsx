import { FileRejection } from "react-dropzone";
import { alpha } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";
import { fData } from "utils/number";
import { CustomFile } from "./type";

// ----------------------------------------------------------------------

type Props = {
  fileRejections: FileRejection[];
};

export function RejectionFiles({ fileRejections }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        borderColor: "error.light",
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size }: CustomFile = file;

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>

            {errors.map((error) => (
              <Typography key={error.code} variant="caption" component="p">
                - {error.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}
