import { ChangeSet, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { yupResolver } from "@hookform/resolvers/yup";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { FormDialog } from "components/Dialogs";
import { MImportStep } from "components/MImportStep";
import { MultiSelect } from "components/Selectors";
import { AttributeColumn, TableWrapper } from "components/Table";
import { BUTTON } from "constants/button";
import { HEIGHT_DEVICE } from "constants/index";
import {
  IMPORT_PRODUCT_COLUMNS,
  IMPORT_PRODUCT_COLUMN_WIDTHS,
  IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS,
  IMPORT_PRODUCT_EXCEL_TEMPLATE,
} from "constants/product";
import { PRODUCT_LABEL } from "constants/product/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import sum from "lodash/sum";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { FieldError, Resolver, useForm } from "react-hook-form";
import { TAttribute } from "types/Attribute";
import { ProductDTO } from "types/Product";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { requiredRule, validate } from "utils/formValidation";
import { handleNotifyErrors } from "utils/handleError";
import { formatOptionSelect } from "utils/option";
import { handleSubmitRowChanges } from "utils/table";
import { showWarning } from "utils/toast";
import { writeFile } from "utils/xlsxFile";
import { importProductSchema } from "validations/importProduct";
import { IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM } from "../ImportFileVariantStepper/GridForm";

export const IMPORT_PRODUCT_RULES = {
  name: requiredRule,
  category: requiredRule,
};

export interface ImportProductForm {
  name?: string;
  note: string;
}

interface ImportFileType {
  /** xử lý dữ liệu trong file. cấp độ ưu tiên 1 */
  handleChangeTableData?: (
    tableData: {
      [key: string]: string | number | boolean | TAttribute;
    }[],
  ) => void;
  /** chỉ nhận file mà không đọc dữ liệu trong file. cấp độ ưu tiên 2 */
  handleSubmitFile?: (file: File, form: ImportProductForm) => void;
  handleSubmitData: () => Promise<boolean>;
}

export function ImportFileProductStepper({
  handleChangeTableData,
  handleSubmitData,
}: ImportFileType) {
  const { category, supplier } = useAppSelector(getDraftSafeSelector("product")).attributes;
  const {
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors, isSubmitted, isSubmitting },
    handleSubmit,
  } = useForm<ImportProductForm>({
    resolver: yupResolver(importProductSchema) as Resolver<any, any>,
    defaultValues: { name: "", note: "" },
  });
  const [tableData, setTableData] = useState<
    { [key: string]: string | number | TAttribute | boolean }[]
  >([]);
  const [validationStatus, setValidationStatus] = useState<{ [key: string]: any }>({});
  const [headerOptions, setHeaderOptions] = useState<TSelectOption[]>([]);
  const [dataExcel, setDataExcel] = useState<[string][]>([]);
  const [selection, setSelection] = useState<(number | string)[]>([]);
  const [columnWidths] = useState<TableColumnWidthInfo[]>(IMPORT_PRODUCT_COLUMN_WIDTHS);
  const { note, name } = watch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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
    reset();
    clearErrors();
    handleBack();
    setDataExcel([]);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setActiveStep(0);
    setDataExcel([]);
    setTableData([]);
    setValidationStatus({});
  };

  const handleSubmitForm = React.useCallback(() => {
    setTableData([]);
    setDataExcel([]);
    reset();
    setValidationStatus({});
    clearErrors();
  }, [clearErrors, reset]);

  const findColumnInHeaderExcel = (label: string) => {
    const idx = dataExcel[0]?.findIndex((item) => item === label);
    return idx;
  };

  const checkColumns = () => {
    const options = map(dataExcel[0], (item, idx) => ({ label: item, value: idx?.toString() }));
    // set options cho tên và sdt
    setHeaderOptions(options);
    // tìm vị trí cột
    const nameIdx = findColumnInHeaderExcel(IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS.NAME);
    if (nameIdx >= 0) {
      setValue("name", nameIdx?.toString(), { shouldDirty: true });
      clearErrors("name");
    }
  };

  const handleFinishStep = () => {
    handleChangeTableData?.(tableData);
    handleNext();
  };

  const refactorDataFromFileToTable = () => {
    handleNext();
    let validateValue: { [key: string]: unknown } = {};
    const nameIdx = findColumnInHeaderExcel(IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS.NAME);
    const noteIdx = findColumnInHeaderExcel(IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS.NOTE);
    const categoryIdx = IMPORT_PRODUCT_COLUMNS.findIndex(
      (column) => column.title === PRODUCT_LABEL.category,
    );
    const resultDataFromFile: { [key: string]: string | number | TAttribute | boolean }[] = map(
      dataExcel.slice(1),
      (column, idx) => {
        const idxNameColumn = name ? (parseInt(name) >= 0 ? parseInt(name) : nameIdx) : nameIdx;

        if (sum([idxNameColumn, categoryIdx]) >= 0) {
          validateValue = {
            ...validateValue,
            ...validate(
              {
                [idx]: { name: column[idxNameColumn], category: "" },
              },
              validateValue,
              IMPORT_PRODUCT_RULES,
            ),
          };
        }
        const product: Pick<ProductDTO, "name" | "note" | "is_active"> = {
          name: column[idxNameColumn],
          note: note || column[noteIdx] || undefined,
          is_active: true,
        };
        return product;
      },
    );
    setTableData(resultDataFromFile);
    setValidationStatus(validateValue);
  };

  const nameError = errors?.name as FieldError;

  const handleSelectField = (name: keyof ImportProductForm, value: string) => {
    setValue(name, value, { shouldDirty: true, shouldValidate: true });
    clearErrors(name);
  };

  const commitChanges = (changes: ChangeSet) => {
    handleSubmitRowChanges({
      changes,
      data: tableData,
      rules: IMPORT_PRODUCT_RULES,
      setTableData,
      setValidationStatus,
      validationStatus,
      getRow: (item) => ({ name: item.name, category: item.category, is_active: true }),
    });
  };

  const submitDataExcel = () => {
    handleChangeTableData && checkColumns();
    handleNext();
  };

  const notificationError = useCallback(() => {
    if (handleChangeTableData) {
      const formatError = Object.keys(validationStatus);
      const firstError = formatError[0];
      if (firstError) {
        const errorName = validationStatus[firstError].name ? PRODUCT_LABEL.name : "";
        const errorCategory = validationStatus[firstError].category ? PRODUCT_LABEL.category : "";
        const error = errorName || errorCategory;
        showWarning(`${PRODUCT_LABEL.error} ${error}`);
      }
    }
  }, [validationStatus, handleChangeTableData]);

  const handleSubmitProduct = async () => {
    const res = await handleSubmitData();
    if (res) {
      setIsOpen(false);
      handleBack();
    }
  };

  const handleSubmitSelected = (name: string, value: string) => {
    const dataClone = [...tableData];
    let changed: { [key: string]: { [name: string]: string } } = {};
    map(selection, (item: number) => {
      changed[item] = { [name]: value };
      dataClone[item] = { ...dataClone[item], [name]: value };
    });
    setValidationStatus(validate(changed, validationStatus, IMPORT_PRODUCT_RULES));
    setTableData(dataClone);
    setSelection([]);
  };

  useEffect(() => {
    notificationError();
  }, [notificationError]);

  useEffect(() => {
    handleNotifyErrors(errors);
  }, [errors]);

  useEffect(() => {
    if (!isOpen) {
      handleSubmitForm();
    }
  }, [isOpen, handleSubmitForm]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="contained">
        <FileUploadIcon style={styles.uploadIcon} />
        {PRODUCT_LABEL.import_file}
      </Button>
      <FormDialog
        transition
        maxWidth="lg"
        buttonText={BUTTON.ADD}
        title={PRODUCT_LABEL.import_file}
        open={isOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit(handleSubmitProduct)}
        loading={isSubmitting}
        disabledSubmit={activeStep < 3}
        sx={{ ".MuiDialogContent-root": { paddingBottom: 0, ".MuiPaper-root": { padding: 0 } } }}
      >
        <Box component={Paper} p={1}>
          <MImportStep
            getTemplate={() => writeFile(IMPORT_PRODUCT_EXCEL_TEMPLATE)}
            getBackControlColumn={getBackFromForm}
            handleFinishStep={handleFinishStep}
            isSubmitted={isSubmitted}
            refactorDataFromFileToTable={handleSubmit(
              handleChangeTableData ? refactorDataFromFileToTable : handleNext,
            )}
            submitDataExcel={submitDataExcel}
            disabledCompleted={Object.keys(validationStatus).length > 0}
            activeStep={activeStep}
            importExcel={{ onRead: setDataExcel }}
            dataExcel={dataExcel}
            getBackFromTable={getBackFromTable}
            table={
              handleChangeTableData ? (
                <>
                  <Stack direction={"row"} justifyContent={"end"} p={2} spacing={1}>
                    <MultiSelect
                      options={map(category, formatOptionSelect)}
                      simpleSelect
                      onChange={(value) => handleSubmitSelected("category", value.toString())}
                      outlined
                      title={PRODUCT_LABEL.category}
                      inputProps={{ InputLabelProps: { shrink: true } }}
                      disabled={!selection.length}
                      value={""}
                    />
                    <MultiSelect
                      value={""}
                      options={map(supplier, formatOptionSelect)}
                      simpleSelect
                      onChange={(value) => handleSubmitSelected("supplier", value.toString())}
                      outlined
                      title={PRODUCT_LABEL.supplier}
                      inputProps={{ InputLabelProps: { shrink: true } }}
                      disabled={!selection.length}
                    />
                  </Stack>
                  <TableWrapper
                    data={{ data: tableData, loading: false, count: tableData.length }}
                    columns={IMPORT_PRODUCT_COLUMNS}
                    defaultColumnOrders={IMPORT_PRODUCT_COLUMNS.map((item) => item.name)}
                    heightTable={HEIGHT_DEVICE - 320}
                    showSelectAll
                    defaultColumnWidths={columnWidths}
                    selection={selection}
                    setSelection={setSelection}
                    hiddenPagination
                    editRowChangeForInline={commitChanges}
                    validationCellStatus={validationStatus}
                    columnEditExtensions={[{ columnName: "rowId", editingEnabled: false }]}
                    cellStyle={{ height: 80 }}
                    showAddCommand
                    showDeleteCommand
                    addButtonLabel={BUTTON.ADD}
                    deleteButtonLabel={BUTTON.DELETE}
                    cancelCommand={BUTTON.CANCEL}
                    commitCommand={BUTTON.ADD}
                    showEditCommand={false}
                  >
                    <AttributeColumn attributes={category} for={["category"]} />
                    <AttributeColumn attributes={supplier} for={["supplier"]} />
                  </TableWrapper>
                </>
              ) : undefined
            }
            gridFormComponent={
              <>
                {handleChangeTableData && (
                  <GridFieldWrap item xs={12} container spacing={2}>
                    <GridFieldWrap item xs={12} md={6}>
                      <MultiSelect
                        options={headerOptions}
                        label={PRODUCT_LABEL.name}
                        error={nameError}
                        title={IMPORT_PRODUCT_EXCEL_FORM_COLUMN_ASSETS.NAME}
                        {...IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM}
                        selectorId="customer-field-input"
                        value={name}
                        onChange={(value) => handleSelectField("name", value as string)}
                      />
                    </GridFieldWrap>
                  </GridFieldWrap>
                )}
              </>
            }
          />
        </Box>
      </FormDialog>
    </>
  );
}

const GridFieldWrap = styled(Grid)`
  padding: 10px 0px;
  div {
    margin: 0px;
  }
`;

const styles: TStyles<"uploadIcon"> = {
  uploadIcon: { fontSize: "1.7rem" },
};
