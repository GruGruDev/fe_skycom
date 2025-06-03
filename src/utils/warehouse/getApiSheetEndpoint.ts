import { TSheetType } from "types/Sheet";

export const getApiSheetEndpoint = (type?: TSheetType) =>
  `${
    type === "IP" || type === "EP"
      ? "sheet-import-export/"
      : type === "TF"
        ? "sheet-transfer/"
        : "sheet-check/"
  }`;
