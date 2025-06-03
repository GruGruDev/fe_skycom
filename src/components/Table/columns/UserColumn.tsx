import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { MultiSelect, MultiSelectProps, ValueSelectorType } from "components/Selectors";
import { LABEL } from "constants/label";
import isObject from "lodash/isObject";
import { TSelectOption } from "types/SelectOption";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  options?: TSelectOption[];
  onChange?: (values: ValueSelectorType, row?: any) => Promise<void>;
}

export const UserColumn = ({
  for: columnNames = [],
  options = [],
  ...props
}: Props & Partial<MultiSelectProps>) => {
  const Formatter = ({
    value,
    row,
  }: {
    value: string | number | (string | number | object | null)[];
    row?: any;
  }) => {
    const formatValue = isObject(value) ? (value as any).id : value;
    return (
      <MultiSelect
        outlined
        {...props}
        title={LABEL.SELECT}
        options={options}
        value={formatValue}
        disabled={!props.onChange}
        onChange={(value) => props.onChange?.(value, row)}
      />
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};
