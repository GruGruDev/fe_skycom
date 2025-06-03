import { ChangeSet, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { FormDialog } from "components/Dialogs";
import { MImportStep } from "components/MImportStep";
import { TableWrapper } from "components/Table";
import { BUTTON } from "constants/button";
import { HEIGHT_DEVICE } from "constants/index";
import {
  BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS,
  BULK_UPDATE_VARIANT_EXCEL_TEMPLATE,
  BULK_UPDATE_VARIANT_COLUMNS,
  BULK_UPDATE_VARIANT_COLUMN_WIDTHS,
} from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import map from "lodash/map";
import sum from "lodash/sum";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { TSelectOption } from "types/SelectOption";
import { requiredRule, validate } from "utils/formValidation";
import { handleSubmitRowChanges } from "utils/table";
import { showError, showWarning } from "utils/toast";
import { writeFile } from "utils/xlsxFile";
import GridForm from "./GridForm";
import { TParams } from "types/Param";
import { productApi } from "apis/product";
import { SUCCESS_STATUS } from "constants/httpStatusCode";
import { saveBlobData } from "utils/saveBlobData";

const BULK_UPDATE_VARIANT_RULES = {
  SKU_code: requiredRule,
  // neo_price: requiredRule,
  sale_price: requiredRule,
};

export interface BulkUpdateVariantForm {
  SKU_code?: string;
  neo_price: number;
  sale_price: number;
}

interface ImportFileType {
  /** chỉ nhận file mà không đọc dữ liệu trong file. cấp độ ưu tiên 2 */
  handleSubmitFile?: (file: File, form: BulkUpdateVariantForm) => void;

  open: boolean;
  onClose: () => void;
  onGetData?: () => void;
}

export function ImportFileBulkUpdateVariant({ onClose, onGetData, open }: ImportFileType) {
  const [tableData, setTableData] = useState<any>([]);
  const [validationStatus, setValidationStatus] = useState<{ [key: string]: any }>({});
  const [headerOptions, setHeaderOptions] = useState<TSelectOption[]>([]);
  const [dataExcel, setDataExcel] = useState<[string][]>([]);
  const [columnWidths] = useState<TableColumnWidthInfo[]>(BULK_UPDATE_VARIANT_COLUMN_WIDTHS);
  const [headerColumn, setHeaderColumn] = useState<{
    [key in keyof typeof BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS]: number;
  }>({
    neo_price: -1,
    SKU_code: -1,
    sale_price: -1,
  });

  const [activeStep, setActiveStep] = useState(0);
  const [formFileData, setFormFileData] = useState<TParams[]>([]);

  const handleSubmitVariantFormFile = async () => {
    if (formFileData.length) {
      const res = await productApi.update<Blob>({
        endpoint: "variants/bulk-update/",
        params: formFileData,
        responseType: "blob",
      });

      if ((res as any).status === SUCCESS_STATUS.PARTIAL_CONTENT) {
        saveBlobData(res.data as Blob);
        return true;
      }

      if (res.data) {
        onGetData?.();
        return true;
      }
      return false;
    }
    showError(PRODUCT_LABEL.file_not_have_data);
    return false;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getBackFromTable = () => {
    setTableData([]);
    handleBack();
  };

  const getBackFromForm = () => {
    handleBack();
    setDataExcel([]);
  };

  const handleCloseForm = () => {
    onClose();
    setActiveStep(0);
    setDataExcel([]);
    setTableData([]);
    setValidationStatus({});
  };

  const handleSubmitForm = React.useCallback(() => {
    setTableData([]);
    setDataExcel([]);
    setValidationStatus({});
  }, []);

  const findColumnInHeaderExcel = useCallback(
    (label: string) => {
      const idx = dataExcel[0]?.findIndex((item) => item === label);
      return idx;
    },
    [dataExcel],
  );

  const handleCheckHeaderColumn = useCallback(() => {
    setHeaderColumn((prev) => {
      {
        const headerColumnTemp = { ...prev };
        for (const key in BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS) {
          if (Object.prototype.hasOwnProperty.call(BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS, key)) {
            const att = key as keyof typeof BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS;
            const element = BULK_UPDATE_VARIANT_BY_EXCEL_COLUMNS[att];
            const columnIdx = findColumnInHeaderExcel(element);
            headerColumnTemp[att] = columnIdx;
          }
        }
        return headerColumnTemp;
      }
    });
  }, [findColumnInHeaderExcel]);

  const checkColumns = () => {
    const options = map(dataExcel[0], (item, idx) => ({ label: item, value: idx }));
    setHeaderOptions(options);
    handleCheckHeaderColumn();
  };

  const handleFinishStep = () => {
    setFormFileData(tableData);
    handleNext();
  };

  const refactorDataFromFileToTable = () => {
    handleNext();
    let validateValue: { [key: string]: unknown } = {};

    const resultDataFromFile = map(dataExcel.slice(1), (column, idx) => {
      const variant = {
        SKU_code: column[headerColumn.SKU_code],
        sale_price: column[headerColumn.sale_price],
        neo_price: column[headerColumn.neo_price],
      };
      const total = sum(Object.values(variant));
      if (total >= 0) {
        validateValue = {
          ...validateValue,
          ...validate(
            {
              [idx]: variant,
            },
            validateValue,
            BULK_UPDATE_VARIANT_RULES,
          ),
        };
      }
      return variant;
    });
    setTableData(resultDataFromFile);
    setValidationStatus(validateValue);
  };

  const commitChanges = (changes: ChangeSet) => {
    handleSubmitRowChanges({
      changes,
      data: tableData,
      rules: BULK_UPDATE_VARIANT_RULES,
      setTableData,
      setValidationStatus,
      validationStatus,
      getRow: (item) => ({
        SKU_code: item.SKU_code,
        sale_price: item.sale_price,
        neo_price: item.neo_price,
      }),
    });
  };

  const submitDataExcel = () => {
    checkColumns();
    handleNext();
  };

  const notificationError = useCallback(() => {
    const formatError = Object.keys(validationStatus);

    const firstError = formatError[0];
    if (firstError) {
      let errorMessage = "";
      for (const key in validationStatus[firstError]) {
        if (Object.prototype.hasOwnProperty.call(validationStatus[firstError], key)) {
          const element = validationStatus[firstError][key];
          if (element) {
            errorMessage = element.error;
            break;
          }
        }
      }
      showWarning(`${PRODUCT_LABEL.error} ${errorMessage?.toString()}`);
    }
  }, [validationStatus]);

  const handleSubmitVariants = async () => {
    const res = await handleSubmitVariantFormFile();
    if (res) {
      onClose();
      handleBack();
    }
  };

  useEffect(() => {
    notificationError();
  }, [notificationError]);

  useEffect(() => {
    if (!open) {
      handleSubmitForm();
    }
  }, [open, handleSubmitForm]);

  return (
    <>
      <FormDialog
        transition
        maxWidth="lg"
        buttonText={BUTTON.ADD}
        title={PRODUCT_LABEL.import_file}
        open={open}
        onClose={handleCloseForm}
        onSubmit={handleSubmitVariants}
        disabledSubmit={activeStep < 3}
        sx={{ ".MuiDialogContent-root": { paddingBottom: 0, ".MuiPaper-root": { padding: 0 } } }}
      >
        <Box component={Paper} p={1}>
          <MImportStep
            getTemplate={() => writeFile(BULK_UPDATE_VARIANT_EXCEL_TEMPLATE)}
            getBackControlColumn={getBackFromForm}
            handleFinishStep={handleFinishStep}
            refactorDataFromFileToTable={refactorDataFromFileToTable}
            importExcel={{ onRead: setDataExcel }}
            submitDataExcel={submitDataExcel}
            disabledCompleted={Object.keys(validationStatus).length > 0}
            activeStep={activeStep}
            isSubmitted={false}
            dataExcel={dataExcel}
            getBackFromTable={getBackFromTable}
            table={
              <TableWrapper
                data={{ data: tableData, loading: false, count: tableData.length }}
                columns={BULK_UPDATE_VARIANT_COLUMNS}
                defaultColumnOrders={BULK_UPDATE_VARIANT_COLUMNS.map((item) => item.name)}
                heightTable={HEIGHT_DEVICE - 320}
                showSelectAll
                defaultColumnWidths={columnWidths}
                hiddenPagination
                showAddCommand
                showDeleteCommand
                addButtonLabel={BUTTON.ADD}
                deleteButtonLabel={BUTTON.DELETE}
                cancelCommand={BUTTON.CANCEL}
                commitCommand={BUTTON.ADD}
                showEditCommand={false}
                editRowChangeForInline={commitChanges}
                validationCellStatus={validationStatus}
                cellStyle={{ height: 50 }}
              />
            }
            gridFormComponent={
              <GridForm
                headerOptions={headerOptions}
                values={headerColumn}
                onSelectColumn={(name, value) =>
                  setHeaderColumn((prev) => ({ ...prev, [name]: value }))
                }
              />
            }
          />
        </Box>
      </FormDialog>
    </>
  );
}
