import { warehouseApi } from "apis/warehouse";
import { TableWrapper } from "components/Table";
import { HeaderWrapper } from "components/Table/Header";
import { ImagesColumn } from "components/Table/columns/ImagesColumn";
import { YYYY_MM_DD } from "constants/time";
import {
  PRODUCT_INVENTORY_COLUMNS,
  PRODUCT_INVENTORY_COLUMN_WIDTHS,
} from "constants/warehouse/columns";
import dayjs from "dayjs";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useTable from "hooks/useTable";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useState } from "react";
import { TDGridData } from "types/DGrid";
import { TImage } from "types/Media";
import { TSelectOption } from "types/SelectOption";
import { fDateTime } from "utils/date";
import { formatDataToExport } from "utils/warehouse/exportInventoryExcel";
import { inventoryFilterChipOptions } from "utils/warehouse/inventoryFilterChipOptions";
import { inventoryFilterOptions } from "utils/warehouse/inventoryFilterOptions";
import VariantInventoryTable, { TVariantInventory } from "./VariantInventoryTable";
import { checkPermission } from "utils/roleUtils";
import useAuth from "hooks/useAuth";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";

export interface TProductInventory {
  product_id: string;
  product_name: string;
  product_SKU_code: string;
  product_first_inventory: number;
  category_id: string;
  category_name: string;
  product_last_inventory: number;
  product_c_import: number;
  product_c_export: number;
  variants: TVariantInventory[];
  image: TImage;
}

const initParams = {
  date_from: dayjs(new Date()).subtract(90, "day").format(YYYY_MM_DD),
  date_to: dayjs(new Date()).subtract(0, "day").format(YYYY_MM_DD),
  dateValue: 91,
  limit: 100,
  page: 1,
};

const ProducstInventoryTable = () => {
  const tableProps = useTable({
    columns: PRODUCT_INVENTORY_COLUMNS,
    columnWidths: PRODUCT_INVENTORY_COLUMN_WIDTHS,
    params: initParams,
    storageKey: "WAREHOUSE_INVENTORY_TABLE",
  });
  const { user } = useAuth();
  const warehouses = useAppSelector(getDraftSafeSelector("warehouses")).warehouses;

  const [data, setData] = useState<TDGridData<Partial<TProductInventory>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await warehouseApi.get<TProductInventory>({
      params: tableProps.params,
      endpoint: "inventory/report/",
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));

      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [tableProps.params]);

  useEffect(() => {
    getData();
  }, [getData]);

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

  const isExportFile = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_EXCEL],
    user,
  ).isMatch;

  return (
    <>
      <HeaderWrapper
        {...tableProps}
        filterOptions={inventoryFilterOptions({
          params: tableProps.params,
          setParams: (params) => tableProps.setParams?.({ ...params, page: 1 }),
          warehouseOptions,
        })}
        filterChipOptions={inventoryFilterChipOptions({
          warehouseOptions,
        })}
        onRefresh={getData}
        onSearch={(value) =>
          tableProps.setParams?.({ ...tableProps.params, search: value, page: 1 })
        }
        exportExcel={
          isExportFile
            ? {
                data: formatDataToExport(data.data),
                fileName: `Bao-cao-ton-kho-tu-ngay-${fDateTime(
                  tableProps.params?.date_from?.toString() || null,
                )}-den-ngay-${fDateTime(tableProps.params?.date_to?.toString() || null)}`,
              }
            : undefined
        }
      />
      <TableWrapper
        {...tableProps}
        data={data}
        cellStyle={{ height: 40 }}
        detailComponent={({ row }: { row: TProductInventory }) => (
          <VariantInventoryTable row={row.variants} />
        )}
      >
        <ImagesColumn />
      </TableWrapper>
    </>
  );
};

export default ProducstInventoryTable;
