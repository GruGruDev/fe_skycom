import { Sorting } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import ArrowVerticalIcon from "assets/icons/ArrowVerticalIcon";
import map from "lodash/map";
import { Dispatch } from "react";
import { ColumnShowSortType } from "types/DGrid";
import { DIRECTION_SORT_TYPE } from "types/Sort";

export interface SortColumnProps {
  columnShowSort?: ColumnShowSortType[];
  setColumnShowSort?: Dispatch<ColumnShowSortType[]> | undefined;
  columnSortIndex: number;
  sortInstance?: Sorting[];
  setSortInstance: (columnName: string, fieldName: string, direction: DIRECTION_SORT_TYPE) => void;
}

export function SortColumnPopup(props: SortColumnProps) {
  const { columnShowSort = [], columnSortIndex, sortInstance, setSortInstance } = props;
  const columns = columnShowSort;
  const theme = useTheme();

  const handleToggleSorting = (field: { title: string; name: string }) => {
    const direction =
      sortInstance?.[0].columnName === field?.name
        ? sortInstance?.[0].direction === DIRECTION_SORT_TYPE.ASC
          ? DIRECTION_SORT_TYPE.DESC
          : DIRECTION_SORT_TYPE.ASC
        : DIRECTION_SORT_TYPE.ASC;

    direction && setSortInstance(columns[columnSortIndex].name, field?.name, direction);
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormLabel sx={{ color: theme.palette.primary.main, mb: 3 }}>Sort by:</FormLabel>

      {map(columns[columnSortIndex].fields, (field) => (
        <Stack
          direction="row"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          key={field?.name}
          sx={{ py: 0.25 }}
        >
          <Stack direction="column" display="flex" justifyContent="center" alignItems="center">
            <ArrowVerticalIcon
              direction={
                sortInstance?.[0].columnName === field?.name
                  ? sortInstance?.[0].direction
                  : undefined
              }
              handleClickUp={() =>
                setSortInstance(columns[columnSortIndex].name, field?.name, DIRECTION_SORT_TYPE.ASC)
              }
              handleClickDown={() =>
                setSortInstance(
                  columns[columnSortIndex].name,
                  field?.name,
                  DIRECTION_SORT_TYPE.DESC,
                )
              }
            />
          </Stack>
          <Typography
            sx={{ fontSize: "0.82rem", "&:hover": { color: "primary.main", cursor: "pointer" } }}
            onClick={() => handleToggleSorting(field)}
          >
            {field.title}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}
