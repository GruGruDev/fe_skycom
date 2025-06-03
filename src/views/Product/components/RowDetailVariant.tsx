import { productApi } from "apis/product";
import { TabPanelWrap, TabType } from "components/Tabs";
import { PRODUCT_LABEL } from "constants/product/label";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useContext, useEffect, useState } from "react";
import { TBatch, TVariant, TVariantDetail } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TUser } from "types/User";
import { isMatchRoles } from "utils/roleUtils";
import Sheets from "views/VariantDetail/tabs/Sheets";
import { ProductContext } from "..";
import ProductTable, { ProductTableType } from "./Table";

const VARIANT_DETAIL_TABS = (
  props: {
    batches: TBatch[];
    user: Partial<TUser> | null;
  } & Partial<MaterialTableProps>,
): TabType[] => [
  {
    component: <MaterialTable {...props} />,
    title: "materials",
    label: PRODUCT_LABEL.material,
    role: true,
  },
  {
    component: (
      <Sheets
        tableProps={{ heightTable: 350, isTableInRow: true, hiddenPagination: true }}
        variantId={props.variantId}
      />
    ),
    title: "history_import_export",
    label: PRODUCT_LABEL.import_export_history,
    role: isMatchRoles(
      [
        props.user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
        props.user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
        props.user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
        props.user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
      ],
      props.user?.is_superuser,
    ),
  },
];

export const RowDetailVariant = ({
  row,
  ...props
}: Partial<MaterialTableProps> & { row: Partial<TVariant> }) => {
  const { user } = useAuth();
  const { newCancelToken } = useCancelToken();
  const [batches, setBatches] = useState<TBatch[]>([]);

  const getBatch = useCallback(async () => {
    if (row?.id) {
      const res = await productApi.get<TBatch>({
        endpoint: `batches/`,
        params: {
          limit: 1000,
          page: 1,
          product_variant: row?.id,
          cancelToken: newCancelToken(),
        },
      });
      if (res.data) {
        const { results } = res.data;
        setBatches(results);
        return;
      }
      if (res.error.name === CANCEL_REQUEST) {
        return;
      }
    }
  }, [newCancelToken, row?.id]);

  useEffect(() => {
    getBatch();
  }, [getBatch]);

  return (
    <TabPanelWrap
      vertical
      tabs={VARIANT_DETAIL_TABS({
        batches,
        variantId: row.id,
        ...props,
        user,
        materials: row.materials,
      })}
      tabPanelSx={{ minWidth: 100 }}
      tabStyle={{ height: 40 }}
    />
  );
};

interface MaterialTableProps extends Omit<ProductTableType, "view"> {
  variantId?: string;
  heightTable?: number;
  materials?: TVariantDetail["materials"];
}

const MaterialTable = ({ heightTable, materials = [], ...props }: MaterialTableProps) => {
  const context = useContext(ProductContext)?.materialSimple;

  return (
    <ProductTable
      data={{ data: materials, loading: false, count: materials.length }}
      {...context}
      {...props}
      heightTable={heightTable}
      hiddenPagination
      isTableInRow
    />
  );
};
