import { ChangeSet, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { FormDialog } from "components/Dialogs";
import { MImportStep } from "components/MImportStep";
import { TableWrapper } from "components/Table";
import { BUTTON } from "constants/button";
import { HEIGHT_DEVICE } from "constants/index";
import {
  IMPORT_VARIANT_COLUMNS,
  IMPORT_VARIANT_COLUMN_WIDTHS,
  IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS,
  IMPORT_VARIANT_EXCEL_TEMPLATE,
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

const IMPORT_VARIANT_RULES = {
  name: requiredRule,
  SKU_code: requiredRule,
  product_name: requiredRule,
  product_SKU_code: requiredRule,
  product_category: requiredRule,
};

export interface ImportVariantForm {
  neo_price: number;
  sale_price: number;
  name?: string;
  SKU_code?: string;
  note: string;
  product_name: string;
  product_SKU_code: string;
  product_category: string;
  inventory_quantity: number;
}

interface ImportFileType {
  /** chỉ nhận file mà không đọc dữ liệu trong file. cấp độ ưu tiên 2 */
  handleSubmitFile?: (file: File, form: ImportVariantForm) => void;

  open: boolean;
  onClose: () => void;
  onGetData?: () => void;
}

export function ImportFileVariantModal({
  onGetData,

  onClose,
  open,
}: ImportFileType) {
  const [tableData, setTableData] = useState<any>([]);
  const [validationStatus, setValidationStatus] = useState<{ [key: string]: any }>({});
  const [headerOptions, setHeaderOptions] = useState<TSelectOption[]>([]);
  const [dataExcel, setDataExcel] = useState<[string][]>([]);
  const [columnWidths] = useState<TableColumnWidthInfo[]>(IMPORT_VARIANT_COLUMN_WIDTHS);
  const [headerColumn, setHeaderColumn] = useState<{
    [key in keyof typeof IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS]: number;
  }>({
    inventory_quantity: -1,
    name: -1,
    neo_price: -1,
    note: -1,
    product_SKU_code: -1,
    product_category: -1,
    product_name: -1,
    SKU_code: -1,
    sale_price: -1,
  });

  const [activeStep, setActiveStep] = useState(0);
  const [formFileData, setFormFileData] = useState<TParams[]>([]);

  const handleSubmitVariantFormFile = async () => {
    if (formFileData.length) {
      const res = await productApi.create<Blob>({
        endpoint: "variants/import",
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
        for (const key in IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS) {
          if (Object.prototype.hasOwnProperty.call(IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS, key)) {
            const att = key as keyof typeof IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS;
            const element = IMPORT_VARIANT_EXCEL_FORM_COLUMN_ASSETS[att];
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
        name: column[headerColumn.name],
        SKU_code: column[headerColumn.SKU_code],
        sale_price: column[headerColumn.sale_price],
        neo_price: column[headerColumn.neo_price],
        note: column[headerColumn.note],
        inventory_quantity: column[headerColumn.inventory_quantity],
        product_SKU_code: column[headerColumn.product_SKU_code],
        product_category: column[headerColumn.product_category],
        product_name: column[headerColumn.product_name],
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
            IMPORT_VARIANT_RULES,
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
      rules: IMPORT_VARIANT_RULES,
      setTableData,
      setValidationStatus,
      validationStatus,
      getRow: (item) => ({
        SKU_code: item.SKU_code,
        name: item.name,
        sale_price: item.sale_price,
        note: item.note,
        neo_price: item.neo_price,
        inventory_quantity: item.inventory_quantity,
        product_SKU_code: item.product_SKU_code,
        product_category: item.product_category,
        product_name: item.product_name,
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
            getTemplate={() => writeFile(IMPORT_VARIANT_EXCEL_TEMPLATE)}
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
                columns={IMPORT_VARIANT_COLUMNS}
                defaultColumnOrders={IMPORT_VARIANT_COLUMNS.map((item) => item.name)}
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
