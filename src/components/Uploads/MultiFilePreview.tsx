import { IconButton, List, ListItem, ListItemText, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import { PreviewImage } from "components/Images";
import { AnimatePresence, m } from "framer-motion";
import isString from "lodash/isString";
import { fData } from "utils/number";
import { CustomFile, UploadMultiFileProps } from "./type";
import { NativeCheckbox } from "components/Checkbox";

// ----------------------------------------------------------------------

const getFileData = (file: CustomFile | string) => {
  if (typeof file === "string") {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.url || file.image,
  };
};

// ----------------------------------------------------------------------

export function MultiFilePreview({
  showPreview = false,
  files,
  onRemove,
  onSetDefault,
}: UploadMultiFileProps) {
  return (
    <>
      <List disablePadding>
        <AnimatePresence>
          {files?.map((file: any, index) => {
            const { key, name, size, preview } = getFileData(file as CustomFile);

            if (showPreview) {
              return (
                <ListItem
                  key={key || index}
                  component={m.div}
                  sx={{
                    p: 0,
                    m: 0,
                    mx: 0.5,
                    width: 120,
                    borderRadius: 1.25,
                    overflow: "hidden",
                    position: "relative",
                    display: "inline-flex",
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <PreviewImage src={isString(file) ? file : preview} preview />
                  <Stack
                    sx={{ top: 6, right: 6, left: 6, position: "absolute", height: 20 }}
                    direction={"row"}
                    justifyContent={"space-between"}
                  >
                    {/* <Checkbox color="secondary" /> */}
                    {onSetDefault && (
                      <NativeCheckbox
                        onChange={(e) => onSetDefault(index, e.target.checked)}
                        checked={file.is_default}
                      />
                    )}
                    {onRemove && (
                      <IconButton
                        size="small"
                        onClick={() => onRemove?.(file)}
                        sx={{
                          p: "1px",
                          color: "common.white",
                          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                          "&:hover": {
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                          },
                        }}
                      >
                        <CancelIcon color="error" sx={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    )}
                  </Stack>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={key || index}
                component={m.div}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? "" : fData(size || 0)}
                  primaryTypographyProps={{ variant: "subtitle2" }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />

                <IconButton edge="end" size="small" onClick={() => onRemove?.(file)}>
                  <CancelIcon color="disabled" />
                </IconButton>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>
    </>
  );
}
