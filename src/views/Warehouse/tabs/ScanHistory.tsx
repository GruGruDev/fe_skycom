import { orderApi } from "apis/order";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table/TableWrapper";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { SCAN_CODE_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useCallback, useContext, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TScanHistory } from "types/Sheet";
import { fDateTime } from "utils/date";
import { exportExcel } from "utils/warehouse/exportExcel";
import { WarehouseContext } from "..";
import Header from "../components/Header";
import RowDetail from "../components/ScanHistory/RowDetail";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";

const HistoryScan = () => {
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const props = useContext(WarehouseContext)?.history_scan || {};

  const { user } = useAuth();

  const { setParams } = props;

  const [data, setData] = useState<TDGridData<Partial<TScanHistory>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const params = props.params as { [key: string]: string };

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await orderApi.get<TScanHistory>({
      params,
      endpoint: "confirm/logs/turn/all",
    });

    if (res.data) {
      const { results = [], count = 0 } = res.data;

      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params]);

  useEffect(() => {
    getData();
  }, [getData]);

  const isExportFile = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_EXCEL],
    user,
  ).isMatch;

  return (
    <WrapPage>
      <Header
        setParams={(newParams) => setParams?.({ ...params, ...newParams })}
        onRefresh={getData}
        exportExcel={
          isExportFile
            ? {
                data: data?.data,
                fileName: `lich-su-quet-kho-${fDateTime(Date.now())}`,
                handleFormatData: (item) => exportExcel({ item, label: SCAN_CODE_LABEL, users }),
              }
            : undefined
        }
        loading={data?.loading}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        isFillterScanBy
        isFillterScanAt
        searchPlaceholder={SCAN_CODE_LABEL.search}
        {...props}
      />
      <TableWrapper
        {...props}
        data={data}
        cellStyle={{ height: SIMPLE_CELL_HEIGHT }}
        detailComponent={({ row }) => <RowDetail row={row} />}
      ></TableWrapper>
    </WrapPage>
  );
};

export default HistoryScan;
