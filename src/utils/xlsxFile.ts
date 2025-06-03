import FileSaver from "file-saver";
import XLSX, { BookType } from "xlsx";

export const writeFile = ({
  defaultData,
  handleFormatData,
  fileName,
  isSave = true,
  fileExtension = "xlsx",
  fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
}: {
  defaultData: any[];
  handleFormatData?: (item: any) => any;
  fileName?: string;
  isSave?: boolean;
  fileExtension?: BookType;
  fileType?: string;
}) => {
  /* convert state to workbook */
  // const ws = XLSX.utils.aoa_to_sheet(defaultData);
  const formatData = defaultData.map((item) => (handleFormatData ? handleFormatData(item) : item));
  const ws = XLSX.utils.json_to_sheet(formatData);
  // const wb = XLSX.utils.book_new();
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  let excelBuffer = XLSX.write(wb, {
    bookType: fileExtension,
    type: "array",
    bookSST: true,
    cellStyles: true,
  });

  if (fileExtension === "csv") {
    excelBuffer = formatData.map((row) => row.join(",")).join("\n");
  }
  const data = new Blob([excelBuffer], { type: fileType });

  if (!isSave) {
    return data;
  }
  /* generate XLSX file and send to client */
  // XLSX.writeFile(wb, "sheetjs.xlsx");
  FileSaver.saveAs(data, fileName || "sheetjs" + `.${fileExtension}`);
};

export const readFile = (file: File, callbackData: (data: any[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    /* Parse data */
    const ab = e.target.result;
    const wb = XLSX.read(ab, {
      type: "array",
    });
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
    /* Update state */
    callbackData(data);
    // setData(data);
    // setCols(make_cols(ws["!ref"]));
  };
  reader.readAsArrayBuffer(file);
};
