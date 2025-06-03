import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { LABEL } from "constants/label";

export interface GridFormControlType {
  /** form để validate dữ liệu của excel trước khi đưa dữ liệu vào bảng  */
  gridFormComponent: JSX.Element;
  /** format dữ liệu từ file excel đưa vào bảng  */
  refactorDataFromFileToTable: () => void;
  isDisabledSubmitColumn?: boolean;
  getBackControlColumn: () => void;
  /* Check isShowTableData == true thì không show dữ liệu dạng table ở step này */
  isShowTableData?: boolean;
}
export const GridFormControl = ({
  gridFormComponent,
  refactorDataFromFileToTable,
  isDisabledSubmitColumn = false,
  isShowTableData,
  getBackControlColumn,
}: GridFormControlType) => {
  return (
    <>
      <Grid container spacing={2}>
        {gridFormComponent}
      </Grid>
      <Box sx={{ mb: 2 }}>
        <div>
          <Button
            variant="contained"
            onClick={refactorDataFromFileToTable}
            sx={{ mt: 1, mr: 1 }}
            disabled={isDisabledSubmitColumn}
          >
            {isShowTableData ? LABEL.CONTINUE : LABEL.COMPLETED}
          </Button>

          <Button onClick={getBackControlColumn} sx={{ mt: 1, mr: 1 }}>
            {LABEL.GO_BACK}
          </Button>
        </div>
      </Box>
    </>
  );
};
