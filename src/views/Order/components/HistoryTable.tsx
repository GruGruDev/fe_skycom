import { orderApi } from "apis/order";
import { WrapPage } from "components/Page";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { ORDER_HISTORY_COLUMN, ORDER_HISTORY_COLUMN_WIDTH } from "constants/order/columns";
import map from "lodash/map";
import React, { useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { THistoryOrder } from "types/Order";
import { fDateTime } from "utils/date";
import Table from "./Table";

const initParams = {
  limit: 50,
  page: 1,
  ordering: "-history_date",
};

const HistoryTable = ({
  orderID,
  isDetail = true,
  onRefresh,
}: {
  orderID: string;
  isDetail?: boolean;
  onRefresh: () => void;
}) => {
  const [data, setData] = useState<TDGridData<Partial<THistoryOrder>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = React.useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<THistoryOrder>({
      params: { ...initParams },
      endpoint: `${orderID}/histories/`,
    });
    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      const data = map(results, (item, idx) => ({
        ...item,
        history_modified_by: item?.modified_by,
        history_modified: fDateTime(item.history_date),
        historyIdx: idx,
      }));
      setData((prev) => ({
        ...prev,
        data,
        loading: false,
        count,
      }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [orderID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <Table
        data={data}
        columns={ORDER_HISTORY_COLUMN}
        defaultColumnWidths={ORDER_HISTORY_COLUMN_WIDTH}
        hiddenPagination
        isFullRow={true}
        isTableInRow={isDetail}
        cellStyle={{ minHeight: SIMPLE_CELL_HEIGHT }}
        heightTable={350}
        onRefresh={onRefresh}
      />
    </WrapPage>
  );
};

export default HistoryTable;
