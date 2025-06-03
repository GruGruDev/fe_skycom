import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { productApi } from "apis/product";
import AddButton from "components/Buttons/AddButton";
import { WrapPage } from "components/Page";
import { BUTTON } from "constants/button";
import { PRODUCT_LABEL } from "constants/product/label";
import { VARIANT_SIMPLE_SORT_COLUMNS } from "constants/product/variant";
import { ROLE_PRODUCT, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { memo, useCallback, useEffect, useState } from "react";
import { productServices } from "services/product";
import { TDGridData } from "types/DGrid";
import { TVariant, VariantDTO } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { fDate } from "utils/date";
import { exportExcelVariant } from "utils/product/exportExcelVariant";
import { checkPermission } from "utils/roleUtils";
import { FormVariantModal } from "./FormVariantModal";
import Header from "./Header";
import { ImportFileVariantModal } from "./ImportFileVariantStepper";
import { RowDetailVariant } from "./RowDetailVariant";
import Table, { ProductTableType } from "./Table";
import useRouteParams from "hooks/useRouteParams";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { TStyles } from "types/Styles";
import { ImportFileBulkUpdateVariant } from "./ImportFileBulkUpdateVariant";

export interface ContainerProps extends ProductTableType {
  tab?: "all" | "simple";
}

const Container = (props: ContainerProps) => {
  const { params, setParams } = props;
  const routeParams = useRouteParams();
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const [openModal, setOpenModal] = useState<"import" | "create" | "update" | null>(null);
  const [data, setData] = useState<TDGridData<Partial<TVariant>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await productApi.get<TVariant>({
      params: { ...params, cancelToken: newCancelToken() },
      endpoint: "variants/",
    });

    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      setData((prev) => {
        return { ...prev, data: results, count, loading: false };
      });
      return;
    }
    if (result.error.name === CANCEL_REQUEST) {
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken]);

  const handleUpdateVariant = async (form: Partial<VariantDTO>) => {
    const res = await productServices.handleUpdateVariant(form);
    return res;
  };

  const handleAddVariant = async (form: Partial<VariantDTO>) => {
    if (form.product) {
      const res = await productServices.handleAddVariant({ ...form, product_id: form.product });
      if (res) {
        getData?.();
      }
      return res;
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setParams?.({ ...params, ...routeParams });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeParams]);

  const isHandle = checkPermission(
    user?.role?.data?.[ROLE_TAB.PRODUCT]?.[ROLE_PRODUCT.HANDLE],
    user,
  ).isReadAndWrite;

  const isExportFile = checkPermission(
    user?.role?.data?.[ROLE_TAB.PRODUCT]?.[ROLE_PRODUCT.EXPORT_EXCEL],
    user,
  ).isMatch;

  return (
    <WrapPage>
      <Header
        {...props}
        sortColumns={VARIANT_SIMPLE_SORT_COLUMNS}
        exportExcel={
          isExportFile
            ? {
                data: data.data,
                fileName: `Danh-sach-bien-the-${fDate(new Date())}`,
                handleFormatData: (item) => exportExcelVariant(item, users),
              }
            : undefined
        }
        setParams={(newParams) => setParams?.({ ...params, ...newParams, page: 1 })}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        searchPlaceholder={PRODUCT_LABEL.search_variant}
        onRefresh={getData}
        loading={data.loading}
        isFilterActive
        isFilterCategory
        isFilterCreatedBy
        rightChildren={
          <>
            <Grid item>
              <Stack direction={"row"} alignItems="center" spacing={1}>
                {isHandle && (
                  <>
                    <Box>
                      <ImportFileVariantModal
                        open={openModal === "import"}
                        onClose={() => setOpenModal(null)}
                        onGetData={getData}
                      />
                      <Button onClick={() => setOpenModal("import")} variant="contained">
                        <FileUploadIcon style={styles.uploadIcon} />
                        {PRODUCT_LABEL.import_file}
                      </Button>
                    </Box>
                    <Box>
                      <FormVariantModal
                        onRefresh={getData}
                        open={openModal === "create"}
                        onClose={() => setOpenModal(null)}
                        handleSubmitModal={handleAddVariant}
                        isSelectProduct
                      />
                      <AddButton
                        onClick={() => setOpenModal("create")}
                        label={BUTTON.CREATE_VARIANT}
                      />
                    </Box>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item>
              <Stack direction={"row"} alignItems="center" spacing={1}>
                {isHandle && (
                  <Box>
                    <ImportFileBulkUpdateVariant
                      open={openModal === "update"}
                      onClose={() => setOpenModal(null)}
                      onGetData={getData}
                    />
                    <Button onClick={() => setOpenModal("update")} variant="contained">
                      <FileUploadIcon style={styles.uploadIcon} />
                      {PRODUCT_LABEL.update_product_variant}
                    </Button>
                  </Box>
                )}
              </Stack>
            </Grid>
          </>
        }
      />

      <Table
        {...props}
        data={data}
        showSelectAll
        onRefresh={getData}
        editComponent={
          isHandle
            ? (contentProps) => {
                return (
                  <FormVariantModal
                    {...contentProps}
                    handleSubmitModal={handleUpdateVariant}
                    onClose={contentProps.onCancelChanges}
                    onRefresh={getData}
                  />
                );
              }
            : undefined
        }
        editButtonLabel={BUTTON.UPDATE}
        detailComponent={(detailProps) => <RowDetailVariant {...detailProps} heightTable={350} />}
      />
    </WrapPage>
  );
};

export default memo(Container);

const styles: TStyles<"uploadIcon"> = {
  uploadIcon: { fontSize: "1.7rem" },
};
