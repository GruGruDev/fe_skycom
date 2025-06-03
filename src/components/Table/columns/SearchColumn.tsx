import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchNumberField from "components/Fields/SearchNumberField";
import { OPERATORS } from "constants/index";
import { TColumn } from "types/DGrid";

export interface SearchColumnProps {
  onSearchColumn?: (params: {
    operators?: { larger?: OPERATORS; smaller?: OPERATORS };
    value: string;
    columnName: string;
    type: "number" | "string";
  }) => void;
}

interface Props extends SearchColumnProps {
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  data?: number;
}

export const SearchColumn = (props: Props) => {
  const Formatter = ({ column }: { column: TColumn }) => {
    return (
      <Box width={"100%"}>
        {column.type === "number" ? (
          <SearchNumberField
            onSearch={(operators, value) => {
              props.onSearchColumn?.({
                operators,
                value,
                columnName: column.name,
                type: "number",
              });
            }}
          />
        ) : (
          <TextField
            fullWidth
            size="small"
            type={column.type}
            onChange={(e) =>
              props.onSearchColumn?.({
                value: e.target.value,
                columnName: column.name,
                type: "string",
              })
            }
          />
        )}
      </Box>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};
