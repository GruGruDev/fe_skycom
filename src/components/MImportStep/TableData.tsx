import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { LABEL } from "constants/label";

/**
 * Is modal include step to transfer from file to table
 * @param getBackFromTable
 * @param handleFinishStep
 * @param validationStatus validate data table
 * @param table table component to show data
 * @returns
 */

export interface TableDataType {
  handleFinishStep: () => void;
  getBackFromTable: () => void;
  disabledCompleted: boolean;
  table?: JSX.Element;
}
export const TableData = ({
  getBackFromTable,
  handleFinishStep,
  disabledCompleted,
  table,
}: TableDataType) => {
  return (
    <>
      {table}
      <Box sx={{ mb: 2 }}>
        <div>
          <Button
            variant="contained"
            onClick={handleFinishStep}
            sx={{ mt: 1, mr: 1 }}
            disabled={disabledCompleted}
          >
            {LABEL.COMPLETED}
          </Button>
          <Button onClick={getBackFromTable} sx={{ mt: 1, mr: 1 }}>
            {LABEL.GO_BACK}
          </Button>
        </div>
      </Box>
    </>
  );
};
