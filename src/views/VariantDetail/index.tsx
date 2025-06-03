import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { productApi } from "apis/product";
import { warehouseApi } from "apis/warehouse";
import { PageWithTitle } from "components/Page";
import HeaderPage from "components/Page/HeaderPage";
import { TabPanelWrap, TabType } from "components/Tabs";
import { ORDER_STATUS_VALUE } from "constants/order";
import { PRODUCT_LABEL } from "constants/product/label";
import { ROLE_CUSTOMER, ROLE_ORDER, ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { INVENTORY_LOG_LABEL } from "constants/warehouse/label";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PATH_DASHBOARD } from "routers/paths";
import { getListInventoryReasons } from "store/redux/warehouses/action";
import { TBatch, TComboVariant, TVariantDetail, VARIANT_TYPE } from "types/Product";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TUser } from "types/User";
import { TInventory } from "types/Warehouse";
import { forOf } from "utils/forOf";
import { checkPermission, isMatchRoles } from "utils/roleUtils";
import { showError } from "utils/toast";
import Customer from "views/Customer";
import GeneralInfo from "./components/GeneralInfo";
import Combo from "./tabs/Combo";
import Inventory from "./tabs/Inventory";
import Orders from "./tabs/Orders";
import Sheets from "./tabs/Sheets";
import { ORDER_LABEL } from "constants/order/label";

export const PRODUCT_DETAIL_TABS = (
  params: {
    id?: string;
    type?: VARIANT_TYPE;
    comboVariant?: TComboVariant[];
  },
  user: Partial<TUser> | null,
): TabType[] => [
  {
    component: (
      <Customer
        defaultParams={{ variant: params.id, order_status: ORDER_STATUS_VALUE.completed }}
        isHandle={false}
        isExport={false}
        tablePropsDefault={{
          hiddenColumnNames: [
            "source",
            "groups",
            "customer_care_staff",
            "customer_note",
            "tags",
            "created",
            "created_by",
          ],
        }}
      />
    ),
    title: "customers",
    label: PRODUCT_LABEL.customer,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.HANDLE], user)
      .isMatch,
  },
  {
    component: <Orders variantId={params.id} />,
    title: "orders",
    label: ORDER_LABEL.order,
    role: checkPermission(user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.HANDLE], user).isMatch,
  },
  {
    component: <Inventory variantId={params.id} />,
    title: "inventory",
    label: INVENTORY_LOG_LABEL.inventory,
    role: checkPermission(
      user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.INVENTORY_HISTORY],
      user,
    ).isMatch,
  },
  {
    component: <Sheets variantId={params.id} />,
    title: "sheets",
    label: PRODUCT_LABEL.import_export_history,
    role: isMatchRoles(
      [
        user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
        user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
        user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
        user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
      ],
      user?.is_superuser,
    ),
  },
  params.type === VARIANT_TYPE.BUNDLE || params.type === VARIANT_TYPE.COMBO
    ? { component: <Combo tableData={comboVariant} />, title: "combo", label: PRODUCT_LABEL.combo }
    : { component: null, title: "", label: "" },
];

let comboVariant: TComboVariant[];

const VariantDetail = ({ variantId, onClose }: { variantId?: string; onClose?: () => void }) => {
  const { id } = useParams();
  const { user } = useAuth();

  const [variant, setVariant] = useState<Partial<TVariantDetail>>();
  const [batches, setBatches] = useState<TBatch[]>([]);
  const [loading, setLoading] = useState(false);

  const { newCancelToken } = useCancelToken();

  const getBatch = useCallback(async () => {
    setLoading(true);
    if (variantId || variant?.id) {
      const res = await productApi.get<TBatch>({
        endpoint: `batches/`,
        params: {
          limit: 1000,
          page: 1,
          product_variant: variantId || variant?.id,
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
    }
    setLoading(false);
  }, [newCancelToken, variantId, variant?.id]);

  const getData = useCallback(async () => {
    const idDetail = variantId || id;
    if (idDetail) {
      setLoading(true);
      const res = await productApi.getById<TVariantDetail>({ endpoint: `variants/${idDetail}/` });
      if (res.data) {
        const { combo_variants = [] } = res.data;

        const form: TVariantDetail = res.data;
        const { quantity_confirm, quantity_non_confirm } = await getInventoryAvailabel(idDetail);
        setVariant({ ...form, quantity_confirm, quantity_non_confirm });
        const tableData = combo_variants.map((item) => {
          return { ...item, ...item.detail_variant };
        }) as TComboVariant[];

        comboVariant = tableData;
      } else {
        showError(PRODUCT_LABEL.error_get_product);
      }
      setLoading(false);
    }
  }, [id, variantId]);

  // lấy danh sách lô
  const getInventoryAvailabel = async (product_variant?: string) => {
    let quantity_confirm = 0;
    let quantity_non_confirm = 0;
    if (product_variant) {
      setLoading(true);
      const res = await warehouseApi.get<TInventory>({
        params: { limit: 100, page: 1, product_variant },
        endpoint: "inventory-available/",
      });
      setLoading(false);
      if (res.data) {
        forOf(res.data.results, (item) => {
          quantity_confirm += parseInt((item.quantity_confirm || 0).toString());
          quantity_non_confirm += parseInt((item.quantity_non_confirm || 0).toString());
        });
      }
    }
    return { quantity_confirm, quantity_non_confirm };
  };

  const handleUpdateBatch = () => {
    getBatch();
  };

  useEffect(() => {
    getBatch();
  }, [getBatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    Promise.all([getListInventoryReasons()]);
  }, []);

  return (
    <PageWithTitle title={PRODUCT_LABEL.product_details}>
      <HeaderPage link={`/${PATH_DASHBOARD.product.list["simple-variant"]}`} onNavigate={onClose} />
      <Box padding={[0, 1, 2, 3, 4, 5]}>
        <Paper elevation={3} style={styles.baseInfoWrapper}>
          {loading ? (
            <ProductSkeleton />
          ) : (
            <GeneralInfo
              batches={batches}
              variant={variant}
              onRefresh={getData}
              handleAddBatch={(batch) => setBatches((prev) => [batch, ...prev])}
              handleUpdateBatch={handleUpdateBatch}
              onUpdateVariant={setVariant}
            />
          )}
        </Paper>
        <Paper variant="elevation" elevation={4} sx={styles.tableWrapper}>
          <TabPanelWrap
            tabs={PRODUCT_DETAIL_TABS(
              { type: variant?.type, comboVariant, id: variantId || id },
              user,
            )}
            tabBodySx={{ width: "100%" }}
            tabStyle={{ minWidth: "unset" }}
          />
        </Paper>
      </Box>
    </PageWithTitle>
  );
};

export default VariantDetail;

const styles = {
  baseInfoWrapper: { padding: 24 },
  tableWrapper: { marginTop: 4, marginBottom: 4, padding: 2 },
};

function ProductSkeleton() {
  return (
    <Stack spacing={1} p={2} direction={"row"}>
      <Box width={"100%"}>
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} />
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
        </Stack>
      </Box>
      <Box width={"100%"}>
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "0.82rem" }} />
          <Skeleton variant="rounded" height={36} />
          <Skeleton variant="rounded" height={36} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
        </Stack>
      </Box>
    </Stack>
  );
}
