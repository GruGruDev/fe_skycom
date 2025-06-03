import { Box, Stack, Typography } from "@mui/material";
import UploadIllustration from "assets/icons/UploadIllustration";
import { LABEL } from "constants/label";

// ----------------------------------------------------------------------

export function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: "column", md: "row" }}
      sx={{ width: 1, textAlign: { xs: "center", md: "left" } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box>
        <Typography fontWeight="bold" gutterBottom>
          {LABEL.DRAG_AND_DROP_IMAGE}
        </Typography>

        <Typography fontSize="0.82rem" sx={{ color: "text.secondary" }}>
          {LABEL.SIZE_OF_FILE_LESS_THAN_2MB}
        </Typography>
      </Box>
    </Stack>
  );
}
