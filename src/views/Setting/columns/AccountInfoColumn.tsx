import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import HandlerImage from "components/Images/HandlerImage";
import { GridLineLabel } from "components/Texts";
import { TStyles } from "types/Styles";
import { TUser } from "types/User";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  editColumnNames?: string[];
}

const COLUMN_NAMES = ["accountInfo"];

export const AccountInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TUser }) => {
    return (
      <Stack gap={1} direction="row">
        <HandlerImage width="50px" height="100%" style={styles.image} value={row?.images} />
        <Stack gap={1}>
          <GridLineLabel value={row?.name} />
          <GridLineLabel value={row?.email} />
          <GridLineLabel value={row?.phone} />
        </Stack>
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

const styles: TStyles<"image"> = {
  image: { objectFit: "cover" },
};
