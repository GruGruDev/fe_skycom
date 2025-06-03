import { userApi } from "apis/user";
import AddButton from "components/Buttons/AddButton";
import { WrapPage } from "components/Page";
import { formatValueChangeMultiSelector } from "components/Selectors";
import { AttributeColumn, TableWrapper } from "components/Table";
import { HeaderWrapper } from "components/Table/Header";
import { ImagesColumn } from "components/Table/columns/ImagesColumn";
import { SwitchColumn } from "components/Table/columns/SwitchColumn";
import { SIMPLE_CELL_HEIGHT } from "constants/index";
import { ROLE_SETTING, ROLE_TAB } from "constants/role";
import {
  ACCOUNT_COLUMNS,
  ACCOUNT_COLUMNS_SHOW_SORT,
  ACCOUNT_COLUMN_WIDTHS,
  ACCOUNT_SIMPLE_COLUMNS,
  ACCOUNT_SIMPLE_COLUMN_WIDTHS,
} from "constants/user/columns";
import { USER_LABEL } from "constants/user/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import useSettings from "hooks/useSettings";
import useTable from "hooks/useTable";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { fetchUser, updateUser } from "store/redux/users/action";
import { TDGridData } from "types/DGrid";
import { TParams } from "types/Param";
import { CANCEL_REQUEST } from "types/ResponseApi";
import { TUser } from "types/User";
import { filterIsShowOptions } from "utils/option";
import { checkPermission } from "utils/roleUtils";
import { filterChips } from "utils/user/filterChips";
import { filterOptions } from "utils/user/filterOptions";
import AccountHistory from "../AccountHistory";
import { AccountInfoColumn } from "../columns/AccountInfoColumn";
import AccountModal from "../components/AccountModal";

const USER_FORM_DEFAULT: Partial<TUser> = {
  name: "",
  email: "",
  password: "",
};

const initParams = { limit: 500, page: 1 };

const Account = () => {
  const { user } = useAuth();
  const { tableLayout } = useSettings();
  const { listRoles } = useAppSelector(getDraftSafeSelector("roles"));
  const { departments } = useAppSelector(getDraftSafeSelector("settings"));
  const { newCancelToken } = useCancelToken();
  const [formState, setFormState] = useState({ open: false });
  const [data, setData] = useState<TDGridData<TUser>>({ data: [], loading: false, count: 0 });

  const groupTableProps = useTable({
    columns: ACCOUNT_COLUMNS,
    columnWidths: ACCOUNT_COLUMN_WIDTHS,
    columnShowSort: ACCOUNT_COLUMNS_SHOW_SORT,
    hiddenColumnNames: ["is_online", "is_assign_lead_campaign"],
  });

  const simpleTableProps = useTable({
    columns: ACCOUNT_SIMPLE_COLUMNS,
    columnWidths: ACCOUNT_SIMPLE_COLUMN_WIDTHS,
    hiddenColumnNames: ["is_online", "is_assign_lead_campaign"],
  });

  const [params, setParams] = useState<TParams>(initParams);

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const result = await userApi.get<TUser>({
      endpoint: "",
      params: { ...params, cancelToken: newCancelToken() },
    });
    if (result.data) {
      const { results = [] } = result.data;

      const userWithoutSuperUserData = results.filter((item) => !item.is_superuser);

      setData({
        data: userWithoutSuperUserData,
        loading: false,
        count: userWithoutSuperUserData.length,
      });
      return;
    }

    if (result?.error?.name === CANCEL_REQUEST) {
      return;
    }

    setData((prev) => ({ ...prev, loading: false }));
  }, [params, newCancelToken]);

  const isHandleUser = checkPermission(
    user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ACCOUNT],
    user,
  ).isReadAndWrite;

  const handleUpdateIsActive = async (isChecked: boolean, row?: Partial<TUser>) => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await updateUser({ is_active: isChecked, id: row?.id });

    if (result) {
      getData();
    }
    setData((prev) => ({ ...prev, loading: false }));
  };

  const onSetParams = (
    name: keyof TUser,
    value: string | number | "all" | "none" | (string | number)[],
  ) => {
    const formatValue = formatValueChangeMultiSelector(value);
    setParams?.({ ...params, [name]: formatValue, page: 1 });
  };

  const handleRefreshUserStore = async () => {
    setData((prev) => ({ ...prev, loading: true }));
    await fetchUser();
    setData((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const tableProps = tableLayout === "group" ? groupTableProps : simpleTableProps;

  const roleOptions = useMemo(() => {
    return filterIsShowOptions(listRoles);
  }, [listRoles]);
  const departmentOptions = useMemo(() => {
    return filterIsShowOptions(departments);
  }, [departments]);

  return (
    <WrapPage>
      <HeaderWrapper
        {...tableProps}
        onRefresh={handleRefreshUserStore}
        params={params}
        setParams={setParams}
        searchPlaceholder={USER_LABEL.search_placeholder}
        onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
        // exportExcel={{
        //   data: data.data,
        //   fileName: `Danh_sanh_nhan_su_${fDateTime(new Date())}`,
        //   handleFormatData: (item) => exportExcel({ item, listRoles, users }),
        // }}
        rightChildren={
          isHandleUser && (
            <>
              <AddButton
                visibled
                onClick={() => setFormState((prev) => ({ ...prev, open: true }))}
              />
              <AccountModal
                open={formState.open}
                onClose={() => setFormState({ open: false })}
                row={USER_FORM_DEFAULT}
                onRefresh={getData}
              />
            </>
          )
        }
        filterOptions={filterOptions({
          onSetParams,
          roles: roleOptions,
          departments: filterIsShowOptions(departments),
          params: params,
        })}
        filterChipOptions={filterChips({
          roles: roleOptions,
          departments: departmentOptions,
        })}
      />
      <TableWrapper
        {...tableProps}
        params={params}
        setParams={setParams}
        data={data}
        editComponent={
          isHandleUser
            ? (contentProps) => {
                return (
                  <AccountModal
                    {...contentProps}
                    onClose={contentProps.onCancelChanges}
                    onRefresh={getData}
                  />
                );
              }
            : undefined
        }
        hiddenPagination
        cellStyle={{ height: tableLayout === "group" ? 80 : SIMPLE_CELL_HEIGHT }}
        detailComponent={({ row }) => <AccountHistory userID={row.id} />}
      >
        <AccountInfoColumn />

        <AttributeColumn for={["department"]} attributes={departments} />
        <AttributeColumn attributes={listRoles} for={["role"]} />

        <SwitchColumn for={["is_active"]} handleChange={handleUpdateIsActive} />
        <ImagesColumn />
      </TableWrapper>
    </WrapPage>
  );
};

export default memo(Account);
