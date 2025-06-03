import { warehouseApi } from "apis/warehouse";
import { WrapPage } from "components/Page";
import { AttributeColumn, TableWrapper } from "components/Table";
import ProductInfoColumn from "components/Table/columns/ProductColumn";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { reduce } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { TAttribute } from "types/Attribute";
import { TDGridData } from "types/DGrid";
import { TSelectOption } from "types/SelectOption";
import { TWarehouseHistory } from "types/Sheet";
import { fDateTime } from "utils/date";
import { exportExcel } from "utils/warehouse/exportExcel";
import { WarehouseContext } from "..";
import Header from "../components/Header";
import { ConfirmInfoColumn } from "../components/columns/ConfirmInfoColumn";
import { LogSheetStatusColumn } from "../components/columns/LogSheetStatusColumn";
import { SheetInfoColumn } from "../components/columns/SheetInfoColumn";
import { checkPermission } from "utils/roleUtils";
import useAuth from "hooks/useAuth";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { SheetNoteColumn } from "../components/columns/SheetNoteColumn";

const History = () => {
  const { users } = useAppSelector(getDraftSafeSelector("users"));
  const { inventoryReasons, warehouses } = useAppSelector(getDraftSafeSelector("warehouses"));
  const props = useContext(WarehouseContext)?.history || {};
  const { user } = useAuth();

  const { setParams } = props;

  const [data, setData] = useState<TDGridData<Partial<TWarehouseHistory>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const params = props.params as { [key: string]: string };

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
    const res = await warehouseApi.get<TWarehouseHistory>({ params, endpoint: "inventory-logs/" });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: formatDataToTable(results), count, loading: false }));
      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params]);

  const warehouseAttributes = warehouses?.map((item) => {
    return { id: item.id, name: item.name };
  }) as TAttribute[];

  const warehouseOptions = reduce(
    warehouses,
    (prev: TSelectOption[], cur) => {
      if (cur.name && cur.id) {
        return [...prev, { label: cur.name, value: cur.id }];
      }
      return prev;
    },
    [],
  );

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
        inventoryReasons={inventoryReasons}
        warehouseOptions={warehouseOptions}
        isFilterCreator
        isFilterCreatedDate
        isFilterConfimer
        isFilterConfirmDate
        isFilterProductCategory
        isFilterStatus
        isFilterWarehouse
        isFilterSheetType
        searchPlaceholder={INVENTORY_LOG_LABEL.search}
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

export default History;
