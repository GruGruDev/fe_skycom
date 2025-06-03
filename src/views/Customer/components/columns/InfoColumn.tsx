import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TCustomer } from "types/Customer";
import { TStyles } from "types/Styles";
import { maskedPhone } from "utils/strings";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["customer_info"];

export const InfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TCustomer }) => {
    return (
      <Stack>
        <Link style={styles.link} href={`${document.location.origin}/customer/${row?.id}`}>
          {row?.name}
        </Link>
        {row?.phones?.map((item) => {
          return (
            <Typography key={item.id} style={styles.phoneLabel}>
              {maskedPhone(item.phone || "")}
            </Typography>
          );
        })}
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

const styles: TStyles<"link" | "phoneLabel"> = {
  link: { fontWeight: "bold" },
  phoneLabel: { fontSize: "0.82rem" },
};
