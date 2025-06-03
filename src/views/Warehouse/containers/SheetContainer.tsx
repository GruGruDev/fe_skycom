import { alpha, useTheme } from "@mui/material";
import { warehouseApi } from "apis/warehouse";
import { PageWithTitle, WrapPage } from "components/Page";
import { AttributeColumn, LinkColumn, TableWrapper } from "components/Table";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { SHEET_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import reduce from "lodash/reduce";
import { memo, useCallback, useEffect, useState } from "react";
import { PATH_DASHBOARD } from "routers/paths";
import { TAttribute } from "types/Attribute";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { WAREHOUSE_PATH } from "types/Router";
import { TSheet } from "types/Sheet";
import { checkPermission } from "utils/roleUtils";
import { showError, showSuccess } from "utils/toast";
import { exportExcel } from "utils/warehouse/exportExcel";
import Header, { HeaderWarehouseProps } from "../components/Header";
import { ConfirmInfoColumn } from "../components/columns/ConfirmInfoColumn";
import { SheetStatusColumn } from "../components/columns/SheetStatusColumn";
import ScanModal from "../components/modals/ScanModal";
import { WarehouseTableType } from "../components/tables/WarehouseTable";
import SheetModal from "components/Sheet/SheetModal";
import { getApiSheetEndpoint } from "utils/warehouse/getApiSheetEndpoint";

interface Props
  extends Omit<WarehouseTableType, "onRefresh">,
    Omit<HeaderWarehouseProps, "onRefresh"> {
  setParams?: (params: TParams) => void;
  isAddSheet?: boolean;
}

const SheetContainer = (props: Props) => {
  const { setParams, type, isAddSheet } = props;
  const { user } = useAuth();
  const theme = useTheme();

  const endpoint = getApiSheetEndpoint(type);

  const { newCancelToken } = useCancelToken();
  const { inventoryReasons, warehouses } = useAppSelector(getDraftSafeSelector("warehouses"));
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const [formState, setFormState] = useState({ loading: false, error: false, open: false });
  const [isShowScan, setShowScan] = useState(false);
  const [selection, setSelection] = useState<(number | string)[]>([]);

  const [data, setData] = useState<TDGridData<Partial<TSheet>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const params = props.params as { [key: string]: string };

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await warehouseApi.get<TSheet>({
      params: { ...params, cancelToken: newCancelToken() },
      endpoint,
    });

    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    if (result.error.name === CANCEL_REQUEST) {
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken, endpoint]);

  const handleConfirmSheet = async () => {
    const sheets = reduce(
      selection,
      (prev: { id?: string; is_confirm: boolean }[], cur) => {
        const idx = parseInt(cur.toString());
        const id = data.data[idx]?.id;
        return [...prev, { id, is_confirm: true }];
      },
      [],
    );
    const params = { sheets };
    const res = await warehouseApi.create({
      params,
      endpoint: `${endpoint}bulk-update-is-confirm/`,
    });
    if (res.data) {
      showSuccess(SHEET_LABEL.confirm_sheet_success);
      getData();
      setSelection([]);
      return true;
    } else {
      showError(SHEET_LABEL.confirm_sheet_error);
      return false;
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const warehouseAttributes = reduce(
    warehouses,
    (prev: TAttribute[], item) => {
      return [...prev, { id: item.id, name: item.name }];
    },
    [],
  );

  const isExportFile = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_EXCEL],
    user,
  ).isMatch;

  return (
    <PageWithTitle title={SHEET_LABEL.list_sheet}>
      <WrapPage>
        <SheetModal
          onRefresh={getData}
          open={formState.open}
          onClose={() => setFormState((prev) => ({ ...prev, open: false }))}
          defaultType={type}
        />
        {props.isScanCode && type && (
          <ScanModal open={isShowScan} handleClose={() => setShowScan(false)} type={type} />
        )}
        <Header
          {...props}
          isAdd={isAddSheet}
          isScanCode={props.isScanCode}
          setParams={(newParams) => props?.setParams?.({ ...params, ...newParams })}
          onRefresh={getData}
          exportExcel={
            isExportFile
              ? {
                  ...props.exportExcel,
                  data: data.data,
                  handleFormatData: (item) =>
                    exportExcel({ item, label: SHEET_LABEL, users, inventoryReasons, warehouses }),
                }
              : undefined
          }
          loading={data.loading}
          onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
          setFormOpen={() => setFormState((prev) => ({ ...prev, open: true }))}
          setFormScan={() => setShowScan(true)}
          inventoryReasons={inventoryReasons}
          searchPlaceholder={SHEET_LABEL.search}
          onConfirmSheet={selection.length && isAddSheet ? handleConfirmSheet : undefined}
        />
        <TableWrapper
          {...props}
          data={data}
          selection={selection}
          setSelection={setSelection}
          showSelectAll
          cellStyle={{ height: 100 }}
          editComponent={
            isAddSheet
              ? (contentProps) => (
                  <SheetModal
                    {...contentProps}
                    onRefresh={getData}
                    onClose={contentProps.onCancelChanges}
                    defaultType={type}
                  />
                )
              : undefined
          }
          rowStyleByRowData={(row) => {
            return {
              backgroundColor: row.is_confirm
                ? alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
                : row.is_delete
                  ? alpha(theme.palette.error.main, theme.palette.action.selectedOpacity)
                  : "unset",
            };
          }}
        >
          <AttributeColumn attributes={inventoryReasons} for={["change_reason"]} />
          <AttributeColumn
            attributes={warehouseAttributes}
            for={["warehouse", "warehouse_from", "warehouse_to"]}
          />
          <LinkColumn
            for={["code"]}
            linkFromRow={(row) =>
              `${window.location.origin}${PATH_DASHBOARD.warehouse[""]}/${WAREHOUSE_PATH.SHEET}/${
                row?.id
              }?type=${type ? type : ""}`
            }
          />
          <LinkColumn
            for={["order_key"]}
            linkFromRow={(row) =>
              `${window.location.origin}${PATH_DASHBOARD.orders[""]}/${row?.order}`
            }
          />
          <ConfirmInfoColumn />
          <AttributeColumn for={["tags"]} />
          <SheetStatusColumn />
        </TableWrapper>
      </WrapPage>
    </PageWithTitle>
  );
};

export default memo(SheetContainer);
