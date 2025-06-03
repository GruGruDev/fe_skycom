import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TOrderV2 } from "types/Order";
import map from "lodash/map";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["sheet"];

export const SheetColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: TOrderV2["sheet"] }) => {
    return (
      <Stack direction={"row"} spacing={0.5}>
        {map(value, (sheet, index) => (
          <Typography
            component={"a"}
            fontSize={"0.825rem"}
            key={index}
            href={`${window.location.origin}/warehouse/sheet/${sheet.id}?type=EP`}
            color={sheet.is_confirm ? "success.main" : "error.main"}
          >
            {sheet.code}
          </Typography>
        ))}
      </Stack>
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
