import { TableFilterRow } from "@devexpress/dx-react-grid-material-ui";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import SearchNumberField from "components/Fields/SearchNumberField";
import { TColumn } from "types/DGrid";

export interface FilterCellProps extends TableFilterRow.CellProps {
  filterCellCompnent?: (props: TableFilterRow.CellProps) => React.ReactNode | JSX.Element;
}

const FilterCell = (props: FilterCellProps) => {
  const columnType = (props.tableColumn.column as TColumn).type;
  if (columnType === "number") {
    return (
      <TableCell>
        <SearchNumberField
          onSearch={(operators, value) =>
            props.onFilter({
              columnName: props.column.name,
              value: { operators, value, type: "number", columnName: props.column.name },
            })
          }
        />
      </TableCell>
    );
  }

  return props.filterCellCompnent ? (
    props.filterCellCompnent(props)
  ) : (
    <TableCell>
      <TextField
        fullWidth
        disabled={!props.filteringEnabled}
        size="small"
        onChange={(e) => {
          props.onFilter({
            columnName: props.column.name,
            value: { value: e.target.value, type: "text", columnName: props.column.name },
          });
        }}
        value={props.filter?.value?.value}
      />
    </TableCell>
  );
};

export default FilterCell;
