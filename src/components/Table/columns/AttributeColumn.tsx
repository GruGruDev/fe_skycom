import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Typography from "@mui/material/Typography";
import find from "lodash/find";
import map from "lodash/map";
import { useEffect } from "react";
import { TAttribute } from "types/Attribute";
import { MultiSelect } from "components/Selectors";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  editColumnNames?: string[];
  attributes?: TAttribute[];
  direction?: "row" | "column";
}

export const AttributeColumn = ({ for: columnNames = [], direction = "row", ...props }: Props) => {
  const Formatter = ({ value }: { value?: any }) => {
    if (value?.name) {
      return <Typography>{value.name}</Typography>;
    }
    if (typeof value === "string") {
      const attribute = find(props.attributes, (item) => item.id === value);

      return <Typography>{attribute?.name}</Typography>;
    } else {
      const attributes = value?.map((item: string | Partial<TAttribute>) => {
        if (typeof item === "string") {
          return {
            id: item,
            name:
              props.attributes?.find((attr) => attr.id === item)?.name ||
              props.attributes?.find((attr) => attr.id === item)?.tag,
          };
        } else {
          return {
            id: item.id,
            name: item.name || item.tag,
          };
        }
      }) as TAttribute[];

      return (
        <Stack direction={direction} spacing={0.5}>
          {map(attributes, (item, idx) => (
            <Chip label={item.name} key={idx} size="small" style={chipStyle} component="span" />
          ))}
        </Stack>
      );
    }
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

    const options = map(props.attributes, (item) => ({
      label: item.name || "",
      value: item.id || "",
    }));

    return (
      <ClickAwayListener onClickAway={blurInput}>
        <MultiSelect
          options={options}
          value={editProps.value}
          fullWidth
          simpleSelect
          onChange={editProps.onValueChange}
          title={editProps.column.title}
        />
      </ClickAwayListener>
    );
  };

  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      editorComponent={Editor}
      {...props}
      for={columnNames}
    />
  );
};

const chipStyle = { marginRight: 4 };
