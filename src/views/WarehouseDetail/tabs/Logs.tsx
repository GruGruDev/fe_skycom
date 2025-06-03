import { warehouseApi } from "apis/warehouse";
import { WrapPage } from "components/Page";
import { AttributeColumn, TableWrapper } from "components/Table";
import ProductInfoColumn from "components/Table/columns/ProductColumn";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import reduce from "lodash/reduce";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TAttribute } from "types/Attribute";
import { TDGridData } from "types/DGrid";
import { TWarehouseHistory } from "types/Sheet";
import { fDateTime } from "utils/date";
import { exportExcel } from "utils/warehouse/exportExcel";
import { ConfirmInfoColumn } from "views/Warehouse/components/columns/ConfirmInfoColumn";
import { LogSheetStatusColumn } from "views/Warehouse/components/columns/LogSheetStatusColumn";
import { SheetInfoColumn } from "views/Warehouse/components/columns/SheetInfoColumn";
import { WarehouseDetailContext } from "..";
import Header from "../components/Header";
import { checkPermission } from "utils/roleUtils";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import { SheetNoteColumn } from "views/Warehouse/components/columns/SheetNoteColumn";

const Logs = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const { warehouses, inventoryReasons } = useAppSelector(getDraftSafeSelector("warehouses"));
  const props = useContext(WarehouseDetailContext)?.logs || {};

  const { setParams, params } = props;

  const [data, setData] = useState<TDGridData<Partial<TWarehouseHistory>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const formatDataToTable = (results: TWarehouseHistory[]) => {
    return reduce(
      results,
      (prev: TWarehouseHistory[], cur) => {
        return [...prev, { ...cur, product_variant: cur.product_variant_batch?.product_variant }];
      },
      [],
    );
  };

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await warehouseApi.get<TWarehouseHistory>({
      params: { ...params, warehouse: id },
      endpoint: "inventory-logs/",
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: formatDataToTable(results), count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params, id]);

  const warehouseAttributes = warehouses.map((item) => {
    return { id: item.id, name: item.name };
  }) as TAttribute[];

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
                data: data.data,
                fileName: `lich-su-ton-kho-${fDateTime(Date.now())}`,
                handleFormatData: (item) =>
                  exportExcel({
                    item,
                    label: INVENTORY_LOG_LABEL,
                    users,
                    warehouses,
                    inventoryReasons,
                  }),
              }
            : undefined
        }
        loading={data?.loading}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        {...props}
      />
      <TableWrapper {...props} data={data} cellStyle={{ height: 80 }}>
        <SheetInfoColumn />
        <AttributeColumn attributes={inventoryReasons} for={["change_reason"]} />
        <AttributeColumn attributes={warehouseAttributes} for={["warehouse"]} />
        <ProductInfoColumn for={["product_variant"]} />
        <LogSheetStatusColumn />
        <ConfirmInfoColumn />
        <SheetNoteColumn />
      </TableWrapper>
    </WrapPage>
  );
};

export default Logs;
