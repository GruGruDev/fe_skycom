import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { TOrderV2 } from "types/Order";
import { TStyles } from "types/Styles";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["general_info"];

export const GeneralInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    return (
      <Stack gap={1} alignItems="flex-start">
        {row?.is_cross_sale && (
          <GridLineLabel label={`${ORDER_LABEL.is_cross_sale}:`} value={row.value_cross_sale} />
        )}
        <GridLineLabel
          label={`${ORDER_LABEL.tags}:`}
          value={
            row?.tags?.length
              ? row.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    size="small"
                    color="primary"
                    variant="outlined"
                    style={styles.tagChip}
                    label={tag.name}
                  />
                ))
              : "---"
          }
        />
        <GridLineLabel label={`${ORDER_LABEL.sale_note}:`} value={row?.sale_note || "---"} />
        <GridLineLabel
          label={`${ORDER_LABEL.delivery_note}:`}
          value={row?.delivery_note || "---"}
        />
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

const styles: TStyles<"tagChip"> = {
  tagChip: { marginRight: 4 },
};
