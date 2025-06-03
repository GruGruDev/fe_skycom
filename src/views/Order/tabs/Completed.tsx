import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useContext } from "react";
import { fDateTime } from "utils/date";
import { OrderContext } from "views/Order";
import Container from "views/Order/components/Container";
import MCompleted from "./MCompleted";

const Success = () => {
  const context = useContext(OrderContext);
  const isDesktop = useResponsive("up", "sm");

  const { tableLayout } = useSettings();

  const tableProps = tableLayout === "group" ? context?.completed : context?.completedSimple;

  return isDesktop ? (
    <div className="relative">
      <Container
        {...tableProps}
        params={context?.completedParams}
        setParams={context?.setCompletedParams}
        exportExcel={{ fileName: `Danh-sach-don-xac-nhan-${fDateTime(Date.now())}` }}
        tabName="completed"
        isFilterTag
        isFilterCreator
        isFilterConfirmDate
        isFilterPaymentType
        isFilterCarrierStatus
        isFilterDate
        isSearch
        isFilterSource
      />
    </div>
  ) : (
    <MCompleted />
  );
};
export default Success;
