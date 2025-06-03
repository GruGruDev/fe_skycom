import AddButton from "components/Buttons/AddButton";
import { TableWrapper } from "components/Table";
import { HeaderWrapper } from "components/Table/Header";
import { WrapPage } from "components/Page";
import { ROLE_SETTING, ROLE_TAB } from "constants/role";
import { ROLE_LABEL } from "constants/role/label";
import { PERMISSION_COLUMNS, PERMISSION_COLUMN_WIDTHS } from "constants/user/columns";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import useTable from "hooks/useTable";
import reduce from "lodash/reduce";
import { useMemo, useState } from "react";
import { TRole } from "types/Permission";
import { checkPermission } from "utils/roleUtils";
import { searchAlgorithm } from "utils/strings";
import PermissionModal from "./PermissionModal";

const ByRole = () => {
  const { user } = useAuth();
  const { columns, columnWidths, columnOrders, hiddenColumnNames, setHiddenColumnNames } = useTable(
    {
      columns: PERMISSION_COLUMNS,
      columnWidths: PERMISSION_COLUMN_WIDTHS,
    },
  );
  const [searchText, setSearchText] = useState("");
  const listRoles = useAppSelector(getDraftSafeSelector("roles")).listRoles;

  const [open, setOpen] = useState(false);

  const searchData = useMemo(() => {
    return reduce(
      listRoles,
      (prev: TRole[], cur) => {
        if (searchAlgorithm(cur.name, searchText)) {
          return [...prev, cur];
        }
        return prev;
      },
      [],
    );
  }, [searchText, listRoles]);

  const isUpdateRole = checkPermission(
    user?.role?.data?.[ROLE_TAB.SETTINGS]?.[ROLE_SETTING.ROLE],
    user,
  ).isReadAndWrite;

  return (
    <WrapPage>
      <HeaderWrapper
        onSearch={setSearchText}
        columns={columns}
        searchPlaceholder={ROLE_LABEL.typing_role_name_please}
        rightChildren={
          isUpdateRole ? (
            <>
              <AddButton visibled onClick={() => setOpen(true)} />
              <PermissionModal
                onClose={() => setOpen(false)}
                open={open}
                roles={searchData}
                title={ROLE_LABEL.create_role}
              />
            </>
          ) : undefined
        }
        setHiddenColumnNames={setHiddenColumnNames}
        hiddenColumnNames={hiddenColumnNames}
      />
      <TableWrapper
        columns={columns}
        defaultColumnWidths={columnWidths}
        hiddenColumnNames={hiddenColumnNames}
        defaultColumnOrders={columnOrders}
        isFullRow
        hiddenPagination
        editComponent={
          isUpdateRole
            ? (editProps) => (
                <PermissionModal
                  {...editProps}
                  onClose={editProps.onCancelChanges}
                  roles={searchData}
                  title={ROLE_LABEL.update_role}
                />
              )
            : undefined
        }
        data={{ data: searchData, loading: false, count: searchData.length }}
      />
    </WrapPage>
  );
};

export default ByRole;
