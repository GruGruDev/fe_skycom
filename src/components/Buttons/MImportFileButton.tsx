import React from "react";
import { readFile } from "utils/xlsxFile";

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map((x) => `.${x}`)
  .join(",");

export interface ImportFileProps {
  onGet?: (file: File) => void;
  onRead?: (data: [string][]) => void;
  accept?: string;
}

export const MImportFileButton = ({ onRead, onGet, accept = SheetJSFT }: ImportFileProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onGet?.(files[0]);
      onRead && readFile(files[0], onRead);
    }
  };

  return (
    <div className="form-group">
      <input
        type="file"
        className="form-control"
        id="file"
        accept={accept}
        onChange={handleChange}
      />
    </div>
  );
};
