import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
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
  handleChange: (isChecked: boolean, row?: Partial<TUser>) => Promise<void>;
  disabled?: boolean;
}

export const SwitchColumn = ({
  for: columnNames = [],
  handleChange,
  disabled,
  ...props
}: Props) => {
  const Formatter = ({ value, row = {} }: { value?: boolean; row?: Partial<TUser> }) => {
    const [loading, setLoading] = useState(false);

    const handleChecked = async (checked: boolean) => {
      setLoading(true);
      await handleChange(checked, row);
      setLoading(false);
    };

    return (
      <Stack display="flex" direction={"row"} alignItems={"center"}>
        {loading && <CircularProgress size={16} />}
        <Switch
          size="medium"
          disabled={disabled || loading}
          checked={value}
          onChange={(e) => handleChecked(e.target.checked)}
        />
      </Stack>
    );
  };

  return <DataTypeProvider formatterComponent={Formatter} {...props} for={columnNames} />;
};
