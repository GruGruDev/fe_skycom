import { userApi } from "apis/user";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import { HistoryChangeReasonColumn } from "components/Table/columns/HistoryChangeReasonColumn";
import { ACCOUNT_HISTORY_COLUMN, ACCOUNT_HISTORY_COLUMN_WIDTHS } from "constants/user/columns";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TUserHistory } from "types/User";
import { onChangeHistoryFields } from "utils/user/onChangeHistoryFields";

interface Props {
  userID: string;
}

const initParams = {
  page: 1,
  limit: 200,
};
const AccountHistory = ({ userID }: Props) => {
  const { listRoles } = useAppSelector(getDraftSafeSelector("roles"));

  const tableProps = useTable({
    columns: ACCOUNT_HISTORY_COLUMN,
    columnWidths: ACCOUNT_HISTORY_COLUMN_WIDTHS,
  });

  const [data, setData] = useState<TDGridData<TUserHistory>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await userApi.get<TUserHistory>({
      endpoint: `${userID}/history/`,
      params: initParams,
    });
    if (result?.data) {
      const { results = [], count = 0 } = result.data;

      setData((prev) => ({ ...prev, data: results, loading: false, count }));
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [userID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <TableWrapper isTableInRow data={data} heightTable={350} hiddenPagination {...tableProps}>
        <HistoryChangeReasonColumn
          getOldHistoryItem={(idx) => data.data[idx]}
          historyFieldChangeString={onChangeHistoryFields}
          roles={listRoles}
        />
      </TableWrapper>
    </WrapPage>
  );
};

export default AccountHistory;
