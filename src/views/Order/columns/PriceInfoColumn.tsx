import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import Stack from "@mui/material/Stack";
import { GridLineLabel } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { TOrderV2 } from "types/Order";
import { fNumber } from "utils/number";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

const COLUMN_NAMES = ["price_info"];

export const PriceInfoColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ row }: { row?: TOrderV2 }) => {
    return (
      <Stack gap={1}>
        {/* <GridLineLabel
          label={`${ORDER_LABEL.price_total_variant_actual}:`}
          value={fNumber(row?.price_total_variant_actual)}
        /> */}
        <GridLineLabel
          label={`${ORDER_LABEL.price_total_variant_actual_input}:`}
          value={fNumber(row?.price_total_variant_actual_input)}
        />

        {row?.price_delivery_input !== 0 && (
          <GridLineLabel
            label={renderIconLabel(ORDER_LABEL.price_delivery_input, true)}
            value={fNumber(row?.price_delivery_input)}
          />
        )}

        {row?.price_addition_input !== 0 && (
          <GridLineLabel
            label={renderIconLabel(ORDER_LABEL.price_addition_input, true)}
            value={fNumber(row?.price_addition_input)}
          />
        )}

        {row?.price_discount_input !== 0 && (
          <GridLineLabel
            label={renderIconLabel(ORDER_LABEL.price_discount_input)}
            value={fNumber(row?.price_discount_input)}
          />
        )}

        {row?.price_total_discount_order_promotion !== 0 && (
          <GridLineLabel
            label={renderIconLabel(ORDER_LABEL.price_total_discount_order_promotion)}
            value={fNumber(row?.price_total_discount_order_promotion)}
          />
        )}

        <GridLineLabel
          label={`${ORDER_LABEL.price_total_order_actual}:`}
          value={fNumber(row?.price_total_order_actual)}
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

const renderIconLabel = (label: string, isIncreased?: boolean) => (
  <Stack alignItems="center" direction="row">
    {isIncreased ? (
      <AddCircleIcon color="primary" fontSize="small" />
    ) : (
      <DoDisturbOnIcon color="error" fontSize="small" />
    )}
    {label}:
  </Stack>
);
