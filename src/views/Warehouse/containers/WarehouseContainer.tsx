import { PageWithTitle, WrapPage } from "components/Page";
import { BUTTON } from "constants/button";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { WAREHOUSE_LABEL } from "constants/warehouse/label";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import useSettings from "hooks/useSettings";
import { memo, useCallback, useEffect, useState } from "react";
import { warehouseServices } from "services/warehouse";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { ROOT_PATH, WAREHOUSE_PATH } from "types/Router";
import { TWarehouse } from "types/Warehouse";
import { checkPermission } from "utils/roleUtils";
import Header, { HeaderWarehouseProps } from "../components/Header";
import WarehouseModal from "../components/modals/WarehouseModal";
import WarehouseTable, { WarehouseTableType } from "../components/tables/WarehouseTable";

interface Props
  extends Omit<WarehouseTableType, "onRefresh">,
    Omit<HeaderWarehouseProps, "onRefresh"> {
  setParams?: (params: TParams) => void;
}

const WarehouseContainer = (props: Props) => {
  const { setParams } = props;
  const { user } = useAuth();
  const { tableLayout } = useSettings();

  const [formState, setFormState] = useState({ loading: false, error: false, open: false });
  const { newCancelToken } = useCancelToken();

  const params = props.params as { [key: string]: string };

  const [data, setData] = useState<TDGridData<Partial<TWarehouse>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await warehouseServices.getWarehouses({
      ...params,
      cancelToken: newCancelToken(),
    });
    if (result?.results) {
      const { results = [], count = 0 } = result;

      setData((prev) => ({ ...prev, data: results, loading: false, count }));
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  const isReadAndWriteAddWarehouse = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.WAREHOUSE],
    user,
  ).isReadAndWrite;

  return (
    <PageWithTitle title={PAGE_TITLE.warehouse[WAREHOUSE_PATH.LIST][ROOT_PATH]}>
      <WrapPage>
        <WarehouseModal
          onRefresh={getData}
          open={formState.open}
          onClose={() => setFormState((prev) => ({ ...prev, open: false }))}
        />
        <Header
          isAdd={isReadAndWriteAddWarehouse}
          onRefresh={getData}
          searchPlaceholder={WAREHOUSE_LABEL.search_warehouse}
          loading={data?.loading}
          onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
          setFormOpen={() => setFormState((prev) => ({ ...prev, open: true }))}
          {...props}
        />
        <WarehouseTable
          cellStyle={{ height: tableLayout === "group" ? 80 : SIMPLE_CELL_HEIGHT }}
          data={data}
          showSelectAll
          onRefresh={getData}
          editButtonLabel={BUTTON.UPDATE}
          editComponent={(editProps) => (
            <WarehouseModal
              {...editProps}
              onRefresh={getData}
              onClose={editProps.onCancelChanges}
            />
          )}
          {...props}
        />
      </WrapPage>
    </PageWithTitle>
  );
};

export default memo(WarehouseContainer);
