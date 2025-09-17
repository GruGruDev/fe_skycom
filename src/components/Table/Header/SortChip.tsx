import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import map from "lodash/map";
import { useState } from "react";
import { ColumnShowSortType, TColumn, TDGrid } from "types/DGrid";
import { TParams } from "types/Param";
import { TStyles } from "types/Styles";
import {
  detectOrderingLabelFromColumnsUtil,
  detectOrderingLabelFromSortColumnsUtil,
} from "utils/param";

export interface SortProps extends Pick<TDGrid, "setParams"> {
  params?: TParams;
  columnShowSort?: ColumnShowSortType[];
  sortColumns?: TColumn[];
}

const SortChip = ({ columnShowSort, params, setParams, sortColumns }: SortProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const multiOrdering = columnShowSort?.length
    ? detectOrderingLabelFromSortColumnsUtil(columnShowSort, params?.ordering?.toString())
    : detectOrderingLabelFromColumnsUtil(sortColumns, params?.ordering?.toString());

  const handleAddOrdering = (key: string) => {
    const newOrderingValue = params?.ordering ? `${params?.ordering},-${key}` : `-${key}`;
    setParams?.({ ...params, ordering: newOrderingValue });
  };

  const handleDeleteOrdering = (index: number) => {
    let newMultiOrdering = [...multiOrdering];
    newMultiOrdering.splice(index, 1);
    setParams?.({
      ...params,
      ordering: newMultiOrdering.map((orderingValue) => orderingValue.ordering).join(", "),
    });
  };

  const handleChangeOrdering = (
    orderingValue: {
      orderingKey: string;
      label: string;
      direction: "desc" | "asc";
      ordering: string;
    },
    index: number,
  ) => {
    let newMultiOrdering = [...multiOrdering];
    newMultiOrdering[index] = orderingValue;
    setParams?.({
      ...params,
      ordering: newMultiOrdering.map((orderingValue) => orderingValue.ordering).join(", "),
    });
  };

  return (
    // Sửa lỗi: Xóa prop `xs={12}` khỏi Grid container
    <Grid container justifyContent={"end"}>
      {params?.ordering
        ? map(multiOrdering, (orderingValue, index) => (
            <Chip
              key={index}
              size="small"
              onClick={() =>
                handleChangeOrdering(
                  {
                    ...orderingValue,
                    ordering: `${orderingValue.direction === "desc" ? "" : "-"}${
                      orderingValue.orderingKey
                    }`,
                  },
                  index,
                )
              }
              icon={
                orderingValue.direction === "desc" ? (
                  <ArrowDownwardIcon style={styles.orderIcon} />
                ) : (
                  <ArrowUpwardIcon style={styles.orderIcon} />
                )
              }
              label={orderingValue.label}
              onDelete={() => handleDeleteOrdering(index)}
              sx={{ ml: 1 }}
            />
          ))
        : null}
      <>
        <Chip
          size="small"
          component={"button"}
          onClick={handleClick}
          icon={<AddIcon style={styles.orderIcon} />}
          label="Sort"
          sx={{ ml: 1 }}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List sx={{ width: "100%", maxWidth: 360, maxHeight: 500, bgcolor: "background.paper" }}>
            {sortColumns?.map((column) => (
              <ListItemButton key={column.name} disableGutters>
                <ListItemText
                  primary={column.title}
                  sx={{ span: { fontSize: "0.825rem", px: 2 } }}
                  onClick={() => handleAddOrdering(column.name)}
                />
              </ListItemButton>
            ))}
          </List>
        </Popover>
      </>
    </Grid>
  );
};

export default SortChip;

const styles: TStyles<"orderIcon" | "orderButton" | "groupSelector"> = {
  orderIcon: { padding: 2, fontSize: "1rem" },
  orderButton: { minHeight: 32 },
  groupSelector: { width: "100%" },
};
