import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { warehouseApi } from "apis/warehouse";
import { PageWithTitle } from "components/Page";
import HeaderPage from "components/Page/HeaderPage";
import { HeaderWrapper } from "components/Table/Header";
import { WrapperSection } from "components/Texts";
import { BUTTON } from "constants/button";
import { SHEET_LABEL } from "constants/warehouse/label";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PATH_DASHBOARD } from "routers/paths";
import { TDGridData } from "types/DGrid";
import { SHEET_METHOD_LABEL, TSheet, TSheetDetail, TSheetDetailDTO, TSheetType } from "types/Sheet";
import { dirtyRHF } from "utils/formValidation";
import { showError } from "utils/toast";
import InformationForm from "./components/InformationForm";
import Table from "./components/Table";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import { getApiSheetEndpoint } from "utils/warehouse/getApiSheetEndpoint";

let isOriginConfirmed = false;

const SheetDetailPage = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const { user } = useAuth();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const type = query.get("type") as TSheetType;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState<TDGridData<Partial<TSheetDetail>>>({
    data: [],
    loading: false,
    count: 0,
  });

  // prettier-ignore
  const { reset, watch, handleSubmit, control, formState: { dirtyFields } } = useForm<Partial<TSheet>>();

  const values = watch();

  const formatDataToTable = (results: Partial<TSheetDetail>[]) => {
    return reduce(
      results,
      (prev: Partial<TSheetDetail>[], cur) => {
        return [...prev, { ...cur, product_variant: cur.product_variant_batch?.product_variant }];
      },
      [],
    );
  };

  const endpoint = getApiSheetEndpoint(type);

  const handleGoBack = () => {
    navigate(`/${PATH_DASHBOARD.warehouse.list[type || ""]}`);
  };

  const getSheetDetail = useCallback(async () => {
    if (id) {
      setTableData((prev) => ({ ...prev, loading: true }));
      const result = await warehouseApi.getById<TSheetDetailDTO>({
        endpoint: `${endpoint}${id}/`,
      });
      if (result?.data) {
        const {
          change_reason,
          warehouse,
          warehouse_from,
          warehouse_to,
          sheet_detail = [],
          is_confirm,
        } = result.data;
        const formData: Partial<TSheet> = {
          ...result.data,
          change_reason: change_reason?.name,
          warehouse: warehouse?.name,
          warehouse_from: warehouse_from?.name,
          warehouse_to: warehouse_to?.name,
        };
        isOriginConfirmed = is_confirm;
        setTableData((prev) => ({
          ...prev,
          data: formatDataToTable(sheet_detail),
          count: sheet_detail.length,
          loading: false,
        }));
        reset(formData);
        return;
      }
      setTableData((prev) => ({ ...prev, loading: false }));
      showError(SHEET_LABEL.error_get_sheet_info);
    }
  }, [id, endpoint, reset]);

  const handleSubmitForm = async (form: Partial<TSheet>) => {
    const params = dirtyRHF(form, dirtyFields);

    setLoading(true);

    const result = await warehouseApi.update<TSheetDetailDTO>({
      endpoint: `${endpoint}${id}`,
      params: params,
    });
    if (result.data) {
      handleGoBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    getSheetDetail();
  }, [getSheetDetail]);

  const title = `${
    type === "IP"
      ? SHEET_LABEL[SHEET_METHOD_LABEL.IP]
      : type === "EP"
        ? SHEET_LABEL[SHEET_METHOD_LABEL.EP]
        : type === "TF"
          ? SHEET_LABEL[SHEET_METHOD_LABEL.TF]
          : SHEET_LABEL[SHEET_METHOD_LABEL.CK]
  }  ${values.code}`;

  const isRnWImportSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWExport = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWTransfer = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWCheck = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
    user,
  ).isReadAndWrite;

  return (
    <PageWithTitle title={SHEET_LABEL.sheet_details} className="order-detail-page">
      <HeaderPage link={`/${PATH_DASHBOARD.warehouse.list[""]}`} />
      <Box>
        {tableData.loading && <LinearProgress />}
        <Paper variant="outlined" style={styles.wrapper}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="16px"
          >
            <Typography fontSize={"1rem"} fontWeight="600">
              {title}
            </Typography>
            <Box>
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                onClick={handleSubmit(handleSubmitForm)}
                disabled={!Object.keys(dirtyFields).length}
              >
                {BUTTON.SAVE}
              </LoadingButton>
            </Box>
          </Stack>

          {/* form */}
          <InformationForm
            data={values}
            control={control}
            isConfirmed={isOriginConfirmed}
            disabled={
              isOriginConfirmed || !(isRnWImportSheet && isRnWExport && isRnWTransfer && isRnWCheck)
            }
          />
        </Paper>
        {/* table */}
        <WrapperSection
          containerSx={{ marginTop: "32px", marginBottom: "32px", paddingTop: "0px" }}
        >
          <HeaderWrapper />
          <Table tableData={tableData} type={type} />
        </WrapperSection>
      </Box>
    </PageWithTitle>
  );
};

export default SheetDetailPage;

const styles = {
  wrapper: { padding: 32 },
};
