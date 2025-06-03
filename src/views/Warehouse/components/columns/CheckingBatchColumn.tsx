import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { ClickAwayListener } from "@mui/base";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NumberInputField } from "components/Fields";
import { useEffect } from "react";
import { LABEL } from "constants/label";

const COLUMN_NAMES = ["quantity_actual"];

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  label?: string;
  isCheckMaxQuantity?: boolean;
}

export function CheckingBatchColumn({
  for: columnNames = [],
  isCheckMaxQuantity,
  ...props
}: Props) {
  const Formatter = ({ value }: { value?: number }) => {
    return value !== undefined ? (
      <Typography>{value}</Typography>
    ) : (
      <Typography>{LABEL.CLICK_TO_UPDATE}</Typography>
    );
  };

  const Editor = (editProps: React.PropsWithChildren<DataTypeProvider.ValueEditorProps>) => {
    let t: NodeJS.Timeout | null = null;

    const blurInput = () => {
      t = setTimeout(() => {
        editProps.onBlur();
      }, 0);
    };

    useEffect(() => {
      return () => {
        t && window.clearInterval(t);
      };
    }, [t]);

    return (
      <ClickAwayListener onClickAway={blurInput}>
        <Box>
          <NumberInputField
            onChange={(value) => {
              editProps.onValueChange(value);
            }}
            value={editProps.value}
            autoFocus
            maxQuantity={isCheckMaxQuantity ? editProps.row?.quantity : undefined}
          />
        </Box>
      </ClickAwayListener>
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
      editorComponent={Editor}
    />
  );
}
