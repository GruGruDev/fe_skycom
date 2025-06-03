import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Typography from "@mui/material/Typography";
import { MultiSelect } from "components/Selectors";
import { PRODUCT_LABEL } from "constants/product/label";
import { useEffect } from "react";
import { TSelectOption } from "types/SelectOption";
import { findOption } from "utils/option";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  handleSelectProduct?: (products: string) => void;
  products: TSelectOption[];
}

const COLUMN_NAMES = ["product"];

export const VariantSelectorColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value: string }) => {
    const { products } = props;
    const productName = findOption(products, value, "value")?.label;
    return <Typography>{productName}</Typography>;
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
        <MultiSelect
          options={props.products}
          value={editProps.value}
          fullWidth
          simpleSelect
          onChange={editProps.onValueChange}
          title={PRODUCT_LABEL.select_product}
        />
      </ClickAwayListener>
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      editorComponent={Editor}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
