import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { orderApi } from "apis/order";
import { BUTTON } from "constants/button";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { useCallback, useContext, useEffect, useState } from "react";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import { showError } from "utils/toast";
import { OrderContext } from "views/Order";
import CancelReasonCofirmPopover from "./CancelReasonConfirmPopover";

export interface OrderActionProps {
  onCancelOrder: (cancelReasonId: string) => Promise<void>;
  isShowCancelButton?: boolean;
  isFullPage?: boolean;
  onFullPage?: () => void;
  rowId?: string;
  cancelDisabled?: boolean;
}

const HeaderAction = (props: OrderActionProps) => {
  const { onCancelOrder, isShowCancelButton, isFullPage, onFullPage, cancelDisabled } = props;

  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [cancelReasons, setCancelReasons] = useState<TAttribute[]>([]);
  const orderContext = useContext(OrderContext);

  const getCancelReasons = useCallback(async () => {
    if (orderContext?.cancelReasons) {
      setCancelReasons(orderContext.cancelReasons);
      return;
    }
    const result = await orderApi.get<TAttribute>({
      endpoint: "cancel-reason/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setCancelReasons(result.data.results);
    }
  }, [orderContext?.cancelReasons]);

  const isCancelOrderRole = checkPermission(
    user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.CANCEL],
    user,
  ).isMatch;

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isCancelOrderRole) {
      showError(VALIDATION_MESSAGE.CANNOT_CONFIRM_ORDER_ROLE);
      return;
    }
    setAnchorEl(e.currentTarget);
  };

  useEffect(() => {
    getCancelReasons();
  }, [getCancelReasons]);

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1} py={1}>
      {isShowCancelButton && (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            sx={{ width: 110, my: 2 }}
            disabled={cancelDisabled || !isCancelOrderRole}
          >
            {BUTTON.CANCEL_ORDER}
          </Button>
          <CancelReasonCofirmPopover
            cancelReasons={cancelReasons}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            loading={false}
            handleSubmit={onCancelOrder}
          />
        </>
      )}
      {onFullPage && (
        <Button variant="outlined" onClick={onFullPage} sx={{ my: 2 }}>
          {isFullPage ? BUTTON.CLOSE : "Full page"}
        </Button>
      )}
    </Stack>
  );
};

export default HeaderAction;
