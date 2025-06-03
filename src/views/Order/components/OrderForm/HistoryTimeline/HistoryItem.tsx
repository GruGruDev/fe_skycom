import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Typography from "@mui/material/Typography";
import { BUTTON } from "constants/button";
import { ORDER_LABEL } from "constants/order/label";
import { HISTORY_ACTIONS } from "types/History";
import { fDateTime } from "utils/date";
import HistoryContentItem from "./HistoryContentItem";
import OrderItem from "./OrderItem";
import PaymentItem from "./PaymentItem";
import { SHEET_LABEL } from "constants/warehouse/label";
import SheetItem from "./SheetItem";
import { HistorySheetType, OrderHistoryType, OrderPaymentType } from ".";
import { TSheet } from "types/Sheet";
import { TUser } from "types/User";
import { TOrderPaymentDetail } from "types/Order";

const HistoryItem = ({
  value,
  users,
  onRefresh,
}: {
  value: Partial<OrderHistoryType & OrderPaymentType & HistorySheetType>;
  users: TUser[];
  onRefresh: () => void;
}) => {
  let history_of: string | undefined;
  let content: JSX.Element | undefined;

  switch (value.history_of) {
    case "ORDER":
      history_of = ORDER_LABEL.order;
      if (value.history_date && value.history_action === HISTORY_ACTIONS.UPDATE) {
        content = <HistoryContentItem history={value.histories || []} />;
      } else {
        content = <OrderItem users={users} value={value} />;
      }
      break;

    case "PAYMENT":
      history_of = ORDER_LABEL.payment;
      content = (
        <PaymentItem
          value={value as Partial<TOrderPaymentDetail>}
          onRefresh={onRefresh}
          disabled={value.order_status !== "completed"}
        />
      );
      break;

    case "SHEET":
      history_of = SHEET_LABEL.warehouse;
      content = <SheetItem value={value as Partial<TSheet>} />;
      break;

    default:
      break;
  }

  if (value.history_date) {
    return (
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          <Typography fontSize="0.82rem">
            {value.history_action === HISTORY_ACTIONS.CREATE && BUTTON.ADD}
            {value.history_action === HISTORY_ACTIONS.UPDATE && BUTTON.UPDATE}
            {value.history_action === HISTORY_ACTIONS.CONFIRM && BUTTON.CONFIRM}
            {value.history_action === HISTORY_ACTIONS.PRINT && BUTTON.PRINT}
            {value.history_action === HISTORY_ACTIONS.CANCEL && BUTTON.CANCEL}
          </Typography>
          <Typography color="primary.main" fontWeight={"bold"} fontSize="0.82rem">
            {history_of}
          </Typography>
          <Typography fontSize="0.82rem">{fDateTime(value.history_date)}</Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>{content}</TimelineContent>
      </TimelineItem>
    );
  }
  return null;
};

export default HistoryItem;
