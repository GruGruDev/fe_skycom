import Add from "@mui/icons-material/Add";
import { Box, Stack, styled, Table, TableBody } from "@mui/material";
import { MButton } from "components/Buttons";
import { useMemo } from "react";
import { randomHexString } from "utils/random";
import { Conjunction, Operator } from "./AbstractFilterItem";
import ConditionComponent from "./components/FilterCondition";
import { MAP_OPERATOR_WITH_COLUMN_TYPE } from "./constants";
import FilterItem from "./FilterItem";
import FilterSet from "./FilterSet";
import { AirTableColumn } from "./types";
import { PIVOT_LABEL } from "constants/pivot/label";

export const initState: FilterSet = new FilterSet(randomHexString(5), [], Conjunction.AND);

export default function Filter({
  columns = [],
  filter = initState,
  setFilter,
}: {
  columns: AirTableColumn[];
  filter?: FilterSet;
  setFilter: React.Dispatch<React.SetStateAction<FilterSet | undefined>>;

  // handleSubmitFilter: () => void;
}) {
  const columnsObject = useMemo(
    () =>
      columns.reduce(
        (prev: { [key: string]: AirTableColumn } & Partial<AirTableColumn>, current) => ({
          ...prev,
          [current.id]: current,
        }),
        {},
      ),
    [columns],
  );

  const handleAddCondition = (
    filter: FilterSet,
    setFilter: React.Dispatch<React.SetStateAction<FilterSet | undefined>>,
  ) => {
    if (columns.length > 0) {
      const defaultOperator: string | undefined = Object.keys(Operator).find(
        (operatorKey: unknown) => {
          const key = operatorKey as keyof typeof Operator;
          return MAP_OPERATOR_WITH_COLUMN_TYPE[Operator[key]].includes(columns[0].type);
        },
      );
      if (defaultOperator) {
        setFilter({
          ...filter,
          filterSet: [
            ...filter.filterSet,
            new FilterItem(
              randomHexString(5),
              columns[0].id,
              columns[0].key,
              Operator[defaultOperator as keyof typeof Operator],
              "",
            ),
          ],
        });
      }
    }
  };

  const handleChange =
    (
      filter: FilterSet,
      setFilter: React.Dispatch<React.SetStateAction<FilterSet | undefined>>,
      index: number,
    ) =>
    (name: string, key: string) =>
    (value?: any) => {
      if (name === "conjunction") {
        setFilter({
          ...filter,
          conjunction: value,
        });
        return;
      }

      if (name === "columnId") {
        filter.filterSet[index].columnId = value;
        const newColumnType = columnsObject[value].type;
        const operator = filter.filterSet[index].operator;
        const defaultOperator: string | undefined = Object.keys(Operator).find(
          (operatorKey: unknown) => {
            const key = operatorKey as keyof typeof Operator;
            return MAP_OPERATOR_WITH_COLUMN_TYPE[Operator[key]].includes(newColumnType);
          },
        );
        filter.filterSet[index].operator =
          operator && MAP_OPERATOR_WITH_COLUMN_TYPE[operator].includes(newColumnType)
            ? operator
            : Operator[defaultOperator as keyof typeof Operator];
        filter.filterSet[index].value = "";
        filter.filterSet[index].key = key;
      }

      if (name === "operator") {
        filter.filterSet[index].operator = value || Operator.EQUAL;
      }

      if (name === "value") filter.filterSet[index].value = value;
      setFilter({ ...filter });
    };

  const handleDelete =
    (filter: FilterSet, setFilter: React.Dispatch<React.SetStateAction<FilterSet | undefined>>) =>
    (id: string) => {
      setFilter({ ...filter, filterSet: filter.filterSet.filter((item) => item.id !== id) });
    };

  const renderContent = (
    <Box sx={{ minWidth: 300 }}>
      <Stack direction="row" spacing={1} justifyContent={"space-between"}>
        <ButtonStyled
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleAddCondition(filter, setFilter)}
        >
          {PIVOT_LABEL.add_filter}
        </ButtonStyled>
      </Stack>
      <Table
        sx={{
          gap: 1,
          mt: 1,
          maxHeight: "400px",
          overflow: "auto",
          width: "auto",
        }}
      >
        <TableBody>
          {filter?.filterSet?.length > 0 &&
            filter?.filterSet?.map((filterItem, filterItemIndex: number) => {
              return (
                <ConditionComponent
                  filterItemIndex={filterItemIndex}
                  {...filterItem}
                  key={filterItem.id}
                  id={filterItem.id || ""}
                  columns={columns}
                  columnsObject={columnsObject}
                  conjunction={filter.conjunction || Conjunction.AND}
                  onChange={handleChange(filter, setFilter, filterItemIndex)}
                  onDelete={handleDelete(filter, setFilter)}
                />
              );
            })}
        </TableBody>
      </Table>
    </Box>
  );

  return renderContent;
}

const ButtonStyled = styled(MButton)(() => ({
  fontSize: "0.82rem",
}));
