import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
import React from "react";

export interface TableEditProps {
  content?: ({
    onApplyChanges,
    onCancelChanges,
    onChange,
    editingRowIds,
    row,
    open,
  }: {
    row: any;
    onChange: ({ name, value }: { name: string; value: any }) => void;
    onApplyChanges: () => void;
    onCancelChanges: () => void;
    open: boolean;
    editingRowIds?: number[];
  }) => JSX.Element;
}

export const TableEditingPopup = React.memo(({ content }: TableEditProps) => (
  <Plugin>
    <Template name="popupEditing">
      <TemplateConnector>
        {(
          { rows, getRowId, addedRows = [], editingRowIds, createRowChange, rowChanges },
          {
            changeRow,
            changeAddedRow,
            commitChangedRows,
            commitAddedRows,
            stopEditRows,
            cancelAddedRows,
            cancelChangedRows,
          },
        ) => {
          const isNew = addedRows?.length > 0;
          let defaultRow: any;
          let editedRow: any;
          let rowId: string | number;
          if (isNew) {
            rowId = 0;
            editedRow = addedRows?.[rowId];
          } else {
            if (editingRowIds?.length >= 0) {
              [rowId] = editingRowIds;
              const targetRow = rows.filter((row: Partial<any>) => getRowId(row) === rowId)[0];
              defaultRow = { ...targetRow };
              editedRow = { ...targetRow, ...rowChanges[rowId] };
            }
          }

          const processValueChange = ({ name, value }: { name: string; value: string }) => {
            const changeArgs = {
              rowId,
              change: createRowChange(editedRow, value, name),
            };
            if (isNew) {
              changeAddedRow(changeArgs);
            } else {
              changeRow(changeArgs);
            }
          };
          const rowIds = isNew ? [0] : editingRowIds;
          const applyChanges = () => {
            const isEqual = JSON.stringify(defaultRow || {}) === JSON.stringify(editedRow || {});
            if (isEqual) {
              cancelChanges();
            } else {
              if (isNew) {
                commitAddedRows({ rowIds });
              } else {
                stopEditRows({ rowIds });
                commitChangedRows({ rowIds });
              }
            }
          };
          const cancelChanges = () => {
            if (isNew) {
              cancelAddedRows({ rowIds });
            } else {
              stopEditRows({ rowIds });
              cancelChangedRows({ rowIds });
            }
          };

          const open = editingRowIds?.length > 0 || isNew;
          return (
            content &&
            content({
              row: editedRow,
              onChange: processValueChange,
              onApplyChanges: applyChanges,
              onCancelChanges: cancelChanges,
              open,
              editingRowIds,
            })
          );
        }}
      </TemplateConnector>
    </Template>
    <Template name="root">
      <TemplatePlaceholder />
      <TemplatePlaceholder name="popupEditing" />
    </Template>
  </Plugin>
));
