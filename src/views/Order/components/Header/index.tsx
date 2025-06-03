import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { MButton } from "components/Buttons";
import { GridWrapHeaderProps, HeaderWrapper } from "components/Table/Header";
import { BUTTON } from "constants/button";
import { ORDER_LABEL } from "constants/order/label";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { TOrderFilterProps, TOrderStatusValue } from "types/Order";
import { filterIsShowOptions } from "utils/option";
import { filterChips } from "utils/order/filterChips";
import { filterOptions } from "utils/order/filterOptions";
import { checkPermission } from "utils/roleUtils";

export interface HeaderOrderProps
  extends Partial<
      Omit<
        GridWrapHeaderProps,
        | "filterChipCount"
        | "setFilterCount"
        | "onClearAll"
        | "onDelete"
        | "rightChildren"
        | "filterOptions"
        | "filterChipOptions"
      >
    >,
    TOrderFilterProps {
  tabName?: TOrderStatusValue;
  setOpen?: () => void;
}

const OrderHeader = (props: HeaderOrderProps) => {
  const { tagOptions = [], setOpen, tabName } = props;

  const { user } = useAuth();
  const userSlice = useAppSelector(getDraftSafeSelector("users"));

  const isAddOrder = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.HANDLE],
    user,
  ).isReadAndWrite;

  return (
    <HeaderWrapper
      searchPlaceholder={ORDER_LABEL.search_order}
      rightChildren={
        <>
          {setOpen && (
            <Grid item>
              <MButton onClick={setOpen} disabled={!isAddOrder}>
                <AddIcon />
                {BUTTON.CREATE_ORDER}
              </MButton>
            </Grid>
          )}
        </>
      }
      filterOptions={filterOptions({
        userOptions: userSlice.userOptions,
        handleOrderUsers: userSlice.handleOrderUsers,
        tagsOptions: filterIsShowOptions(tagOptions),
        isFilterCustomerCarrier: true,
        ...props,
      })}
      filterChipOptions={filterChips({
        handleOrderUsers: userSlice.handleOrderUsers,
        tagsOptions: filterIsShowOptions(tagOptions),
        userOptions: userSlice.userOptions,
        tabName: tabName,
      })}
      {...props}
    />
  );
};

export default OrderHeader;
