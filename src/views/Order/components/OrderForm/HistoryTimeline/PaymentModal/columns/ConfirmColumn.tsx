import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Switch from "@mui/material/Switch";
import { orderApi } from "apis/order";

const COLUMN_NAMES = ["is_confirm"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onRefresh: () => void;
  disabled?: boolean;
}

export const ConfirmColumn = ({ for: columnNames = [], onRefresh, disabled, ...props }: Props) => {
  const Formatter = ({ value = false, row }: { value: boolean; row?: any }) => {
    const handleConfirmPayment = async (value: boolean) => {
      const res = await orderApi.update({
        endpoint: `payments/${row.id}/`,
        params: { is_confirm: value },
      });
      if (res.data) {
        onRefresh();
      }
    };

    return (
      <Switch
        checked={value}
        disabled={value || disabled}
        onChange={(e) => handleConfirmPayment(e.target.checked)}
      />
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
