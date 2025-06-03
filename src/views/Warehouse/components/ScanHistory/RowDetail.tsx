import { orderApi } from "apis/order";
import { WrapPage } from "components/Page/WrapPage";
import { TableWrapper } from "components/Table/TableWrapper";

import {
  HISTORY_SCAN_DETAIL_COLUMNS,
  HISTORY_SCAN_DETAIL_COLUMNS_WIDTH,
} from "constants/warehouse/columns";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";

import { TDGridData } from "types/DGrid";
import { TScanHistory } from "types/Sheet";
import { ScanInfoColumn } from "../columns/ScanInfoColumn";

interface Props {
  row: TScanHistory;
}

const initParams = {
  page: 1,
  limit: 30,
};

const RowDetail = ({ row }: Props) => {
  const tableProps = useTable({
    columns: HISTORY_SCAN_DETAIL_COLUMNS,
    columnWidths: HISTORY_SCAN_DETAIL_COLUMNS_WIDTH,
    params: initParams,
  });

  const [data, setData] = useState<TDGridData<Partial<TScanHistory>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<TScanHistory>({
      endpoint: "confirm/logs/all",
      params: { ...initParams, turn_number: row.turn_number },
    });
    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [row.turn_number]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <TableWrapper
        isTableInRow
        data={data}
        cellStyle={{ minHeight: 60 }}
        heightTable={350}
        {...tableProps}
        hiddenPagination
      >
        <ScanInfoColumn />
      </TableWrapper>
    </WrapPage>
  );
};
export default RowDetail;
