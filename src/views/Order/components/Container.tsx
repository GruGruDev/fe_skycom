import Dialog from "@mui/material/Dialog";
import { orderApi } from "apis/order";
import { WrapPage } from "components/Page";
import { SlideTransition } from "components/SlideTransition";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { useCancelToken } from "hooks/useCancelToken";
import useSettings from "hooks/useSettings";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routers/paths";
import { TDGridData } from "types/DGrid";
import { TOrderV2 } from "types/Order";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { exportExcel } from "utils/order/exportExcel";
import { OrderContext } from "views/Order";
import Header, { HeaderOrderProps } from "./Header";
import OrderForm from "./OrderForm";
import RowDetail from "./RowDetail";
import Table, { OrderTableType } from "./Table";
import { checkPermission } from "utils/roleUtils";
import useAuth from "hooks/useAuth";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";

interface Props
  extends Partial<Omit<OrderTableType, "data" | "showSelectAll" | "detailComponent" | "onRefresh">>,
    Partial<
      Omit<
        HeaderOrderProps,
        "setOpen" | "onRefresh" | "exportData" | "exportFileName" | "loading" | "onSearch"
      >
    > {
  isSearch?: boolean;
  isCreate?: boolean;
  isShowDetail?: boolean;
  isPrint?: boolean;
  isHiddenHeader?: boolean;
}

const Container = (props: Omit<Props, "data">) => {
  const {
    isCreate = true,
    isShowDetail = true,
    isSearch,
    params,
    setParams,
    tagOptions,
    isPrint,
    isHiddenHeader,
  } = props;
  const navigate = useNavigate();
  const { newCancelToken } = useCancelToken([params]);
  const orderContext = useContext(OrderContext);
  const { user } = useAuth();

  const [selection, setSelection] = useState<(string | number)[]>([]);

  const [data, setData] = useState<TDGridData<TOrderV2>>({
    data: [],
    loading: false,
    count: 0,
  });

  const { tableLayout } = useSettings();
  const tableGroup = tableLayout === "group";

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await orderApi.get<TOrderV2>({
      params: { ...params, cancelToken: newCancelToken() },
    });
    if (result?.data) {
      const { count = 0, results = [] } = result.data;
      setData({ data: results, count, loading: false });
      return;
    }
    if (result.error.name === CANCEL_REQUEST) {
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken]);

  const handleSetParams = (name: string, value: string) => {
    setParams?.({ ...params, [name]: value, page: 1 });
  };

  const handleCreateOrder = () => {
    navigate(`/${PATH_DASHBOARD.orders.create}`);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setSelection([]);
  }, [params]);

  const isExportFile = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.EXPORT_EXCEL],
    user,
  ).isMatch;

  return (
    <WrapPage>
      {!isHiddenHeader && (
        <>
          <Header
            {...props}
            tagOptions={tagOptions || orderContext?.tags}
            setOpen={isCreate ? handleCreateOrder : undefined}
            setParams={(newParams) => setParams?.({ ...params, ...newParams })}
            onRefresh={() => setParams?.({ ...params })}
            exportExcel={
              isExportFile
                ? { ...props.exportExcel, data: data.data, handleFormatData: exportExcel }
                : undefined
            }
            loading={data.loading}
            onSearch={isSearch ? (value: string) => handleSetParams("search", value) : undefined}
          />
        </>
      )}
      <Table
        cellStyle={{ height: tableGroup ? 125 : SIMPLE_CELL_HEIGHT }}
        selection={isPrint ? selection : undefined}
        setSelection={setSelection}
        data={data}
        showSelectAll
        detailComponent={isShowDetail ? ({ row }) => <RowDetail row={row} /> : undefined}
        editComponent={(editProps) => (
          <Dialog
            TransitionComponent={SlideTransition}
            open={editProps.open}
            maxWidth="lg"
            sx={{ ".MuiPaper-root": { width: "100%" } }}
          >
            <OrderForm row={editProps.row} onClose={editProps.onCancelChanges} />
          </Dialog>
        )}
        onRefresh={() => setParams?.({ ...params })}
        {...props}
      />
    </WrapPage>
  );
};

export default memo(Container);
