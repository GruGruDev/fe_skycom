import { productApi } from "apis/product";
import { FormDialog } from "components/Dialogs";
import { PRODUCT_LABEL } from "constants/product/label";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useEffect, useState } from "react";
import { TBatch } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { warehouseApi } from "apis/warehouse";
import { WrapPage } from "components/Page";
import { TableWrapper } from "components/Table";
import {
  PRODUCT_INVENTORY_COLUMNS,
  PRODUCT_INVENTORY_COLUMNS_WIDTHS,
} from "constants/product/columns";
import useTable from "hooks/useTable";
import flatten from "lodash/flatten";
import sumBy from "lodash/sumBy";
import { TInventory } from "types/Warehouse";
import { forOf } from "utils/forOf";
import { formatFloatToString } from "utils/number";

type Props = {
  open: boolean;
  onClose: () => void;
  variantId?: string;
};

const InventoryModal = (props: Props) => {
  const { open, onClose, variantId } = props;
  const [batches, setBatches] = useState<TBatch[]>([]);
  const [loading, setLoading] = useState(false);

  const { newCancelToken } = useCancelToken();

  const getBatch = useCallback(async () => {
    if (variantId && open) {
      setLoading(true);
      const res = await productApi.get<TBatch>({
        endpoint: `batches/`,
        params: {
          limit: 1000,
          page: 1,
          product_variant: variantId,
          cancelToken: newCancelToken(),
        },
      });
      if (res.data) {
        const { results } = res.data;
        setBatches(results);
        setLoading(false);
        return;
      }
      if (res.error.name === CANCEL_REQUEST) {
        return;
      }
      setLoading(false);
    }
  }, [newCancelToken, variantId, open]);

  useEffect(() => {
    getBatch();
  }, [getBatch]);

  return (
    <FormDialog open={open} onClose={onClose} loading={loading} title={PRODUCT_LABEL.inventory}>
      <Inventory batches={batches} />
    </FormDialog>
  );
};

export default InventoryModal;

const Inventory = ({ batches = [] }: { batches?: TBatch[] }) => {
  const tableProps = useTable({
    columns: PRODUCT_INVENTORY_COLUMNS,
    columnWidths: PRODUCT_INVENTORY_COLUMNS_WIDTHS,
    params: { limit: 1000, page: 1, ordering: "-created" },
  });

  const [inventories, setInventories] = useState<TInventory[]>([]);
  const [loading, setLoading] = useState(0);

  const getInventory = useCallback(
    async (batchId: string) => {
      const res = await warehouseApi.get<TInventory>({
        endpoint: `inventory/`,
        params: { product_variant_batch: batchId, ...tableProps.params },
      });
      setLoading((prev) => prev + 1);
      if (res.data) {
        return res.data.results;
      }
      return [];
    },
    [tableProps.params],
  );

  useEffect(() => {
    const getInventories = async () => {
      let batchIds: string[] = [];
      forOf(batches, (item) => batchIds.push(item.id));
      const inventoryGroup = await Promise.all(batchIds.map((item) => getInventory(item)));
      const inventories = flatten(inventoryGroup);
      setInventories(inventories);
    };
    getInventories();
  }, [batches, getInventory]);

  return (
    <WrapPage style={styles.wrapper}>
      <TableWrapper
        {...tableProps}
        hiddenPagination
        heightTable={styles.wrapper.height}
        data={{ data: inventories, count: inventories.length, loading: loading !== batches.length }}
        summaryColumns={[{ columnName: "quantity", type: "sum" }]}
        SummaryColumnsComponent={(params) => {
          const sum = sumBy(params.rows, (o: any) => formatFloatToString(o?.quantity || 0));
          return <h3>{sum}</h3>;
        }}
      />
    </WrapPage>
  );
};

const styles = {
  wrapper: { marginTop: 24, height: 500 },
};
