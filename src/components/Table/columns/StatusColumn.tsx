import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { SxProps, Theme } from "@mui/material";
import { Span } from "components/Texts";
import { PaletteColor } from "types/Styles";
import { findOption } from "utils/option";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  options: { color?: PaletteColor; label: string; value: string | number }[];
}

const StatusColumn = ({ options, ...props }: Props) => {
  const Formatter = ({ value }: { value: string }) => {
    const status = findOption(options, value, "value");

    return (
      <Span color={status?.color} sx={styles.chip}>
        {status?.label || "---"}
      </Span>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};

export default StatusColumn;

const styles: { [key: string]: SxProps<Theme> } = {
  chip: {
    width: "fit-content",
    whiteSpace: "break-spaces",
    lineHeight: "150%",
    height: "auto",
    padding: "4px 8px",
  },
};
