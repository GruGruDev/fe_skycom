import { userApi } from "apis/user";
import { PageWithTitle, WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import { ACTIVITY_COLUMNS, ACTIVITY_COLUMN_WIDTHS } from "constants/activity/columns";
import { PAGE_TITLE } from "constants/pageTitle";
import { useCancelToken } from "hooks/useCancelToken";
import useTable from "hooks/useTable";
import { useCallback, useEffect, useState } from "react";
import { TActivity } from "types/Activity";
import { TDGridData } from "types/DGrid";
import { CANCEL_REQUEST } from "types/ResponseApi";
import Header from "./components/Header";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import StatusColumn from "components/Table/columns/StatusColumn";
import { ACTION_NAME_OPTIONS, ACTION_TYPE_OPTIONS } from "constants/activity";

const initParams = {
  limit: 100,
  page: 1,
  ordering: "-action_time",
};

const Activity = () => {
  const tableProps = useTable({
    columns: ACTIVITY_COLUMNS,
    columnWidths: ACTIVITY_COLUMN_WIDTHS,
    params: initParams,
  });
  const { newCancelToken } = useCancelToken([tableProps.params]);

  const [data, setData] = useState<TDGridData<TActivity>>({ count: 0, data: [], loading: false });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await userApi.get<TActivity>({
      params: { ...tableProps.params, cancelToken: newCancelToken() },
      endpoint: "action-log/",
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    if (res.error.name === CANCEL_REQUEST) {
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [tableProps.params, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <PageWithTitle title={PAGE_TITLE.settings.activity}>
      <WrapPage>
        <Header params={tableProps.params} setParams={tableProps.setParams} onRefresh={getData} />
        <TableWrapper {...tableProps} data={data} cellStyle={{ height: SIMPLE_CELL_HEIGHT }}>
          <StatusColumn for={["action_type"]} options={ACTION_TYPE_OPTIONS} />
          <StatusColumn for={["action_name"]} options={ACTION_NAME_OPTIONS} />
        </TableWrapper>
      </WrapPage>
    </PageWithTitle>
  );
};

export default Activity;
