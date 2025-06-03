import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { TImage } from "types/Media";
import HandlerImage from "components/Images/HandlerImage";

const COLUMN_NAMES = ["images"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  onlyOne?: boolean;
  width?: number;
}

export const ImagesColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value }: { value?: TImage[] | TImage }) => {
    return <HandlerImage value={value} {...props} />;
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
