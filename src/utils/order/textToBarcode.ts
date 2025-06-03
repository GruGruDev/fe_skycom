import JsBarcode from "jsbarcode";

export default function textToBarcode(text: string, displayValue?: boolean) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE128",
    textAlign: "center",
    textPosition: "bottom",
    font: "Monospace",
    fontOptions: "normal",
    fontSize: 18,
    text,
    displayValue: Boolean(displayValue),
  });
  return canvas.toDataURL("image/jpeg");
}
