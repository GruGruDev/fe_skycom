import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ImportFile, ImportProps } from "./ImportFile";
import { GridFormControl, GridFormControlType } from "./GridFormControl";
import { TableData, TableDataType } from "./TableData";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import { LABEL } from "constants/label";
import { StepWrap } from "./StepWrap";

export interface ImportStepProps extends GridFormControlType, TableDataType, ImportProps {
  activeStep: number;
  getTemplate?: () => void;
}

/**
 * Is modal include step to transfer from file to table
 * @param activeStep
 * @param getTemplate template
 * @param isShowSubmitStep Show submit step
 * @returns
 */
export function MImportStep({
  activeStep,
  getTemplate,
  isShowTableData = true,
  ...props
}: ImportStepProps) {
  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {/* 1. import file step */}
        <StepWrap
          activeStep={activeStep}
          index={0}
          title={
            <Stack direction="row" alignItems="center">
              {LABEL.IMPORT_FILE}
              {getTemplate && (
                <Tooltip title={LABEL.IMPORT_FILE_DESCRIPTION}>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={getTemplate}
                    style={styles.button}
                  >
                    <DownloadIcon />
                    {LABEL.IMPORT_FILE_TEMPLATE}
                  </Button>
                </Tooltip>
              )}
            </Stack>
          }
        >
          <ImportFile {...props} />
        </StepWrap>
        {/* 2. fill value for columns */}
        <StepWrap activeStep={activeStep} index={1} title={LABEL.SELECT_COLUMN_VALUE}>
          <GridFormControl {...props} isShowTableData={isShowTableData} />
        </StepWrap>
        {/* 3. submit */}
        {isShowTableData && (
          <StepWrap activeStep={activeStep} index={2} title={LABEL.EDIT_CELL}>
            <TableData {...props} />
          </StepWrap>
        )}
      </Stepper>
    </Box>
  );
}

const styles = {
  button: { marginLeft: 8 },
};
