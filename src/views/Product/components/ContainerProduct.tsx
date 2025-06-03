import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { productApi } from "apis/product";
import AddButton from "components/Buttons/AddButton";
import { NoDataPanel } from "components/NoDataPanel";
import { WrapPage } from "components/Page";
import { AttributeColumn } from "components/Table";
import { BUTTON } from "constants/button";
import { PRODUCT_LABEL } from "constants/product/label";
import { ROLE_PRODUCT, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { memo, useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TProduct, VARIANT_TYPE } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { fDate } from "utils/date";
import { exportExcel } from "utils/product/exportExcel";
import { checkPermission } from "utils/roleUtils";
import FormProductModal from "./FormProductModal";
import Header, { HeaderProductProps } from "./Header";
import { RowDetailProduct } from "./RowDetailProduct";
import Table, { ProductTableType } from "./Table";

export interface ProductContainerProps
  extends ProductTableType,
    Omit<HeaderProductProps, "handleChangeView"> {
  tab?: "all" | "simple";
}

const Container = (props: ProductContainerProps) => {
  const { params, setParams } = props;
  const { user } = useAuth();
  const { category, supplier } = useAppSelector((state) => state.product.attributes);
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const { newCancelToken } = useCancelToken();

  const [data, setData] = useState<TDGridData<Partial<TProduct>>>({
    data: [],
    loading: false,
    count: 0,
  });
  // const [formFileData, setFormFileData] = useState<TParams[]>([]);
  const [openModal, setOpenModal] = useState(false);

  // const handleSubmitProductFormFile = async () => {
  //   if (formFileData.length) {
  //     const res = await productApi.create<TProduct[]>({
  //       endpoint: "bulk-create/",
  //       params: formFileData,
  //     });

  //     if (res.data) {
  //       getData();
  //       return true;
  //     }
  //     return false;
  //   }
  //   showError(PRODUCT_LABEL.file_not_have_data);
  //   return false;
  // };

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await productApi.get<TProduct>({
      params: { ...params, cancelToken: newCancelToken() },
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

  useEffect(() => {
    getData();
  }, [getData]);

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
        searchPlaceholder={PRODUCT_LABEL.search_product}
        exportExcel={
          isExportFile
            ? {
                data: data.data,
                fileName: `Danh-sach-san-pham-${fDate(new Date())}`,
                handleFormatData: (item) => exportExcel(item, category, supplier, users),
              }
            : undefined
        }
        setParams={(newParams) => setParams?.({ ...params, ...newParams, page: 1 })}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        onRefresh={getData}
        loading={data.loading}
        isFilterCategory
        isFilterSupplier
        isFilterActive
        isFilterCreatedBy
        rightChildren={
          <Grid item>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              {/* <ImportFileProductStepper
                handleSubmitData={handleSubmitProductFormFile}
                handleChangeTableData={setFormFileData}
              /> */}
              {isHandle && (
                <>
                  <FormProductModal
                    onRefresh={getData}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                  />
                  <AddButton onClick={() => setOpenModal(true)} label={BUTTON.CREATE_PRODUCT} />
                </>
              )}
            </Stack>
          </Grid>
        }
      />

      <Table
        {...props}
        data={data}
        showSelectAll
        onRefresh={getData}
        editComponent={
          isHandle
            ? (contentProps) => (
                <FormProductModal
                  {...contentProps}
                  onClose={contentProps.onCancelChanges}
                  onRefresh={getData}
                />
              )
            : undefined
        }
        detailComponent={(detailProps) =>
          detailProps.row.type === VARIANT_TYPE.SIMPLE ? (
            <NoDataPanel message={PRODUCT_LABEL.no_data_panel} />
          ) : (
            <RowDetailProduct {...detailProps} heightTable={350} />
          )
        }
        editButtonLabel={BUTTON.UPDATE}
      >
        <AttributeColumn attributes={category} for={["category"]} />
      </Table>
    </WrapPage>
  );
};

export default memo(Container);
