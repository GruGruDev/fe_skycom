import { customerApi } from "apis/customer";
import AddButton from "components/Buttons/AddButton";
import { PageWithTitle, WrapPage } from "components/Page";
import { formatValueChangeMultiSelector } from "components/Selectors/MultiSelect";
import { HeaderWrapper } from "components/Table/Header";
import {
  CUSTOMER_COLUMNS,
  CUSTOMER_COLUMNS_SHOW_SORT,
  CUSTOMER_COLUMN_WIDTHS,
  CUSTOMER_SIMPLE_COLUMNS,
  CUSTOMER_SIMPLE_COLUMN_WIDTHS,
  CUSTOMER_SIMPLE_SORT_COLUMNS,
} from "constants/customer/columns";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_CUSTOMER, ROLE_TAB } from "constants/role";
import { DD_MM } from "constants/time";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import useTable, { TableProps } from "hooks/useTable";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getListCustomerAttributes } from "store/redux/customers/action";
import { TCustomer } from "types/Customer";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { ROOT_PATH } from "types/Router";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { exportExcel } from "utils/customer/exportExcel";
import { filterChips } from "utils/customer/filterChips";
import { filterOptions } from "utils/customer/filterOptions";
import { fDate, fDateTime } from "utils/date";
import { filterIsShowOptions } from "utils/option";
import { checkPermission } from "utils/roleUtils";
import CustomerModal from "./components/CustomerModal";
import History from "./components/History";
import Table from "./components/Table";
import MCustomer from "./MCustomer";

const initParams = {
  limit: 200,
  page: 1,
  ordering: "-created",
};

const Customer = ({
  defaultParams,
  isHandle = true,
  isExport = true,
  tablePropsDefault,
}: {
  defaultParams?: TParams;
  isHandle?: boolean;
  isExport?: boolean;
  tablePropsDefault?: Partial<TableProps>;
}) => {
  const { tableLayout } = useSettings();
  const { user } = useAuth();
  const { attributes } = useAppSelector(getDraftSafeSelector("customer"));
  const isDesktop = useResponsive("up", "sm");

  const groupTableProps = useTable({
    columns: CUSTOMER_COLUMNS,
    columnWidths: CUSTOMER_COLUMN_WIDTHS,
    columnShowSort: CUSTOMER_COLUMNS_SHOW_SORT,
    storageKey: "CUSTOMER_GROUP_TABLE",
  });

  const simpleTableProps = useTable({
    columns: CUSTOMER_SIMPLE_COLUMNS,
    columnWidths: CUSTOMER_SIMPLE_COLUMN_WIDTHS,
    storageKey: "CUSTOMER_SIMPLE_TABLE",
  });

  const [params, setParams] = useState<TParams>(initParams);

  const paramMemo = useMemo(() => {
    return {
      ...defaultParams,
      ...params,
      birthday_from: params.birthday_from
        ? fDate(params.birthday_from as string, DD_MM)
        : undefined,
      birthday_to: params.birthday_to ? fDate(params.birthday_to as string, DD_MM) : undefined,
    };
  }, [params, defaultParams]);

  const [data, setData] = useState<TDGridData<Partial<TCustomer>>>({
    data: [],
    count: 0,
    loading: false,
  });

  const { newCancelToken } = useCancelToken();
  const [formOpen, setFormOpen] = useState(false);

  const { tags, groups, ranks } = useAppSelector(getDraftSafeSelector("customer")).attributes;
  const { handleCustomerUsers, users } = useAppSelector(getDraftSafeSelector("users"));

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await customerApi.get({
      endpoint: "",
      params: { ...paramMemo, cancelToken: newCancelToken() },
    });
    if (result.data) {
      const { results = [], count = 0 } = result.data;
      setData((prev) => ({ ...prev, data: results, loading: false, count }));
      return;
    }

    if (result?.error?.name === CANCEL_REQUEST) {
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [newCancelToken, paramMemo]);

  const onSetParams = (
    name: keyof TCustomer,
    value: string | number | "all" | "none" | (string | number)[],
  ) => {
    const formatValue = formatValueChangeMultiSelector(value);
    setParams?.({ ...params, [name]: formatValue, page: 1 });
  };

  useEffect(() => {
    getListCustomerAttributes();
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const tableProps = tableLayout === "group" ? groupTableProps : simpleTableProps;

  const isReadAndWriteCustomer =
    isHandle &&
    checkPermission(user?.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.HANDLE], user)
      .isReadAndWrite;

  const isExportFile =
    isExport &&
    checkPermission(user?.role?.data?.[ROLE_TAB.CUSTOMER]?.[ROLE_CUSTOMER.EXPORT_EXCEL], user)
      .isMatch;

  const rankOptions = useMemo(() => {
    return reduce(
      attributes.ranks,
      (prev: TSelectOption[], cur) => {
        return [...prev, { value: cur.id, label: cur.name_rank }];
      },
      [],
    );
  }, [attributes.ranks]);

  return (
    <PageWithTitle title={`${PAGE_TITLE.customer.list[ROOT_PATH]}`}>
      {isDesktop ? (
        <WrapPage style={styles.wrapper}>
          <HeaderWrapper
            {...tableProps}
            {...tablePropsDefault}
            sortColumns={CUSTOMER_SIMPLE_SORT_COLUMNS}
            onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
            searchPlaceholder={CUSTOMER_LABEL.search_placeholder}
            exportExcel={
              isExportFile
                ? {
                    data: data.data,
                    fileName: `Danh_sanh_khach_hang_${fDateTime(new Date())}`,
                    handleFormatData: (item) => exportExcel(item, users),
                  }
                : undefined
            }
            onRefresh={getData}
            rightChildren={
              isReadAndWriteCustomer && (
                <>
                  <CustomerModal
                    onRefresh={getData}
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                  />
                  <AddButton onClick={() => setFormOpen(true)} />
                </>
              )
            }
            filterOptions={filterOptions({
              handleCustomerUsers: filterIsShowOptions(handleCustomerUsers),
              tags: filterIsShowOptions(tags),
              groups: filterIsShowOptions(groups),
              ranks: filterIsShowOptions(ranks),
              params: params,
              onSetParams,
              setParams,
            })}
            filterChipOptions={filterChips({
              tags: filterIsShowOptions(tags),
              groups: filterIsShowOptions(groups),
              ranks: filterIsShowOptions(ranks),
              handleCustomerUsers: filterIsShowOptions(handleCustomerUsers),
            })}
            params={params}
            setParams={setParams}
          />

          <Table
            {...tableProps}
            {...tablePropsDefault}
            rankOptions={rankOptions}
            data={data}
            params={params}
            setParams={setParams}
            cellStyle={{ height: tableLayout === "group" ? 100 : SIMPLE_CELL_HEIGHT }}
            editComponent={
              isReadAndWriteCustomer
                ? (editProps) => (
                    <CustomerModal
                      {...editProps}
                      onClose={editProps.onCancelChanges}
                      onRefresh={getData}
                    />
                  )
                : undefined
            }
            detailComponent={({ row }) => <History customerID={row.id} />}
          />
        </WrapPage>
      ) : (
        <MCustomer defaultParams={defaultParams} />
      )}
    </PageWithTitle>
  );
};

export default Customer;

const styles: TStyles<"wrapper"> = {
  wrapper: {},
};
