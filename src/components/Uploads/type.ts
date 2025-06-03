import { MouseEventHandler, ReactNode } from "react";
import { DropzoneOptions } from "react-dropzone";
// @mui
import { SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { FieldError } from "react-hook-form";

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  id?: string;
  path?: string;
  preview?: string;
  url?: string;
  image?: string;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string | null;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
  loading?: boolean;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  error?: FieldError;
  loading?: boolean;
  isMultiple?: boolean;
  files?: (File | string)[];
  showPreview?: boolean;
  onRemove?: (file: { id: string; url: string }) => void;
  onRemoveAll?: VoidFunction;
  onSetDefault?: (index: number, value: boolean) => void;
  sx?: SxProps<Theme>;
  onClickUpload?: MouseEventHandler<HTMLElement> | undefined;
  children?: ReactNode;
  showResult?: boolean;
  style?: React.CSSProperties;
}
