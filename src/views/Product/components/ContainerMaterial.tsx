import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { productApi } from "apis/product";
import AddButton from "components/Buttons/AddButton";
import { WrapPage } from "components/Page";
import { BUTTON } from "constants/button";
import { PRODUCT_LABEL } from "constants/product/label";
import { ROLE_PRODUCT, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import compact from "lodash/compact";
import { memo, useCallback, useEffect, useState } from "react";
import { productServices } from "services/product";
import { TDGridData } from "types/DGrid";
import { TProductMaterial } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { fDate } from "utils/date";
import { exportExcelMaterial } from "utils/product/exportExcelMaterial";
import { checkPermission } from "utils/roleUtils";
import { FormMaterialModal } from "./FormMaterialModal";
import Header, { HeaderProductProps } from "./Header";
import Table, { ProductTableType } from "./Table";

export interface ContainerProps extends ProductTableType, HeaderProductProps {}

const Container = (props: ContainerProps) => {
  const { params, setParams } = props;
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<TDGridData<Partial<TProductMaterial>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await productApi.get<TProductMaterial>({
      params: { ...params, cancelToken: newCancelToken() },
      endpoint: "materials/",
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

  const handleUpdateMaterial = async (form: Partial<TProductMaterial>) => {
    const res = await productServices.handleUpdateMaterial(form);
    return res;
  };

  const handleAddMaterial = async (form: Partial<TProductMaterial>) => {
    const res = await productServices.handleAddMaterial(form);
    if (res) {
      getData?.();
    }
    return res;
  };

  const handleDeleteMaterial = async (deleted: ReadonlyArray<number | string>) => {
    const res = await Promise.all(
      deleted.map((item) => productServices.handleDeleteMaterial(data.data[item as number].id)),
    );
    const isSuccess = !!compact(res).length;
    if (isSuccess) {
      getData();
    }
  };

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
        searchPlaceholder={PRODUCT_LABEL.search_material}
        exportExcel={
          isExportFile
            ? {
                data: data.data,
                fileName: `Danh-sach-nguyen-lieu-${fDate(new Date())}`,
                handleFormatData: (item) => exportExcelMaterial(item, users),
              }
            : undefined
        }
        setParams={(newParams) => setParams?.({ ...params, ...newParams, page: 1 })}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        onRefresh={getData}
        loading={data.loading}
        isFilterActive
        isFilterCreatedBy
        rightChildren={
          <Grid item>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              {isHandle && (
                <>
                  <FormMaterialModal
                    onRefresh={getData}
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    handleSubmitModal={handleAddMaterial}
                  />
                  <AddButton onClick={() => setOpenModal(true)} label={BUTTON.CREATE_MATERIAL} />
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
        showDeleteCommand
        editComponent={
          isHandle
            ? (contentProps) => {
                return (
                  <FormMaterialModal
                    {...contentProps}
                    handleSubmitModal={handleUpdateMaterial}
                    onClose={contentProps.onCancelChanges}
                    onRefresh={getData}
                  />
                );
              }
            : undefined
        }
        editButtonLabel={BUTTON.UPDATE}
        onDeleteRow={handleDeleteMaterial}
      />
    </WrapPage>
  );
};

export default memo(Container);
