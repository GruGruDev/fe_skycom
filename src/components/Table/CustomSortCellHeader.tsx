//component
import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import { SortColumnPopup, SortColumnProps } from "./SortColumnPopup";

export interface ColumnSortProps extends SortColumnProps {
  tableCellProps: TableHeaderRow.CellProps & { style?: React.CSSProperties };
}

export const CustomSortCellHeader = ({ tableCellProps, ...props }: ColumnSortProps) => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLDivElement) | null>(null);

  const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(e?.currentTarget || null);
  };

  return (
    <>
      <Popover
        id={`popover_${tableCellProps.column?.name}`}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SortColumnPopup {...props} />
      </Popover>
      <TableHeaderRow.Cell {...tableCellProps} onClick={handleClickCell} />
    </>
  );
};
