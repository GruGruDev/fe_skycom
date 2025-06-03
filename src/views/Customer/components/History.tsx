import { customerApi } from "apis/customer";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import { GenderColumn } from "components/Table/columns/GenderColumn";
import { HistoryChangeReasonColumn } from "components/Table/columns/HistoryChangeReasonColumn";
import {
  CUSTOMER_HISTORY_COLUMN,
  CUSTOMER_HISTORY_COLUMN_WIDTHS,
} from "constants/customer/columns";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { THistoryCustomer } from "types/Customer";
import { TDGridData } from "types/DGrid";
import { onChangeHistoryFields } from "utils/customer/onChangeHistoryFields";

interface Props {
  customerID: string;
}

const initParams = {
  page: 1,
  limit: 200,
};
const History = ({ customerID }: Props) => {
  const tableProps = useTable({
    columns: CUSTOMER_HISTORY_COLUMN,
    columnWidths: CUSTOMER_HISTORY_COLUMN_WIDTHS,
  });

  const [data, setData] = useState<TDGridData<Partial<THistoryCustomer>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await customerApi.get<THistoryCustomer>({
      endpoint: "history/",
      params: { ...initParams, customer_id: customerID },
    });
    if (result?.data) {
      const { results = [], count = 0 } = result.data;

      const data = results.map((item, idx) => ({ ...item, historyIdx: idx }));

      setData((prev) => ({
        ...prev,
        data,
        loading: false,
        count,
      }));
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [customerID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <TableWrapper isTableInRow data={data} heightTable={350} hiddenPagination {...tableProps}>
        <GenderColumn />
        <HistoryChangeReasonColumn
          getOldHistoryItem={(idx) => data.data[idx]}
          historyFieldChangeString={onChangeHistoryFields}
        />
      </TableWrapper>
    </WrapPage>
  );
};

export default History;
