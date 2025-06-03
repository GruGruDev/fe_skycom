import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TVariant, VARIANT_TYPE } from "types/Product";
import HandlerImage from "components/Images/HandlerImage";

const COLUMN_NAMES = ["product_name"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const ProductNameColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<TVariant> }) => {
    const { name, images, type } = row;

    const isVariant = type === VARIANT_TYPE.SIMPLE;

    return (
      <Stack spacing={2} direction="row" alignItems="center" flexWrap="nowrap">
        <HandlerImage width={"2.5rem"} height={"2.5rem"} value={images} preview />
        {isVariant ? (
          <Link style={styles.link} fontWeight="bold">
            {name}
          </Link>
        ) : (
          <Typography fontWeight={"600"} sx={{ ml: "8px !important" }}>
            {name}
          </Typography>
        )}
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

export default ProductNameColumn;

const styles = {
  link: { cursor: "pointer" },
};
