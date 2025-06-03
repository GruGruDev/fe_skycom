import { fDateTime } from "./date";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export const saveBlobData = async (blob: any) => {
  const data = new Blob([blob], { type: fileType });

  const href = window.URL.createObjectURL(data);

  const anchorElement = document.createElement("a");

  anchorElement.href = href;

  anchorElement.download = `Danh_sach_loi_${fDateTime(new Date())}${fileExtension}`;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);

  window.URL.revokeObjectURL(href);
};
