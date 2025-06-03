import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Span } from "components/Texts";
import { TProductMaterial } from "types/Product";
import { LABEL } from "constants/label";

const COLUMN_NAMES = ["variants"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ListVariantColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TProductMaterial> }) => {
    const { variants = [] } = row;

    return variants.length ? (
      <Stack spacing={2} direction="row" alignItems="center">
        {variants.length > 1 ? (
          <Tooltip
            arrow
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -8],
                    },
                  },
                ],
              },
            }}
            title={
              <Stack spacing={0.5}>
                {variants.map((item) => (
                  <Span key={item.id || ""}>{item.name}</Span>
                ))}
              </Stack>
            }
          >
            <Typography color="primary.main">{LABEL.SEE_MORE}</Typography>
          </Tooltip>
        ) : (
          <Span>{variants[0].name}</Span>
        )}
      </Stack>
    ) : null;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};

export default ListVariantColumn;
