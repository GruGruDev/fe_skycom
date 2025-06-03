import { warehouseApi } from "apis/warehouse";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import ProductInfoColumn from "components/Table/columns/ProductColumn";
import reduce from "lodash/reduce";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TDGridData } from "types/DGrid";
import { TInventory } from "types/Warehouse";
import { WarehouseDetailContext } from "..";
import Header from "../components/Header";

const Inventory = () => {
  const { id } = useParams();
  const props = useContext(WarehouseDetailContext)?.inventory || {};
  const { setParams, params } = props;

  const [data, setData] = useState<TDGridData<Partial<TInventory>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const formatDataToTable = (results: TInventory[]) => {
    return reduce(
      results,
      (prev: TInventory[], cur) => {
        return [...prev, { ...cur, product_variant: cur.product_variant_batch?.product_variant }];
      },
      [],
    );
  };

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    const res = await warehouseApi.get<TInventory>({
      params: { ...params, warehouse_id: id },
      endpoint: "inventory/",
    });
    if (res.data) {
      const { results = [], count = 0 } = res.data;
      setData((prev) => ({ ...prev, data: formatDataToTable(results), count, loading: false }));

      return;
    }
    setData((prev) => ({ ...prev, loading: false }));
  }, [params, id]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <WrapPage>
      <Header
        setParams={(newParams) => setParams?.({ ...params, ...newParams })}
        onRefresh={getData}
        loading={data?.loading}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        {...props}
      />
      <TableWrapper {...props} data={data} cellStyle={{ height: 80 }}>
        <ProductInfoColumn for={["product_variant"]} />
      </TableWrapper>
    </WrapPage>
  );
};

export default Inventory;
