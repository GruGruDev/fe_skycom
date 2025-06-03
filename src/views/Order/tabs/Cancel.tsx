import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useContext } from "react";
import { fDateTime } from "utils/date";
import { OrderContext } from "views/Order";
import Container from "views/Order/components/Container";
import MCancel from "./MCancel";

const Canceled = () => {
  const context = useContext(OrderContext);
  const isDesktop = useResponsive("up", "sm");

  const { tableLayout } = useSettings();

  const tableProps = tableLayout === "group" ? context?.cancel : context?.cancelSimple;

  return isDesktop ? (
    <div className="relative">
      <Container
        {...tableProps}
        params={context?.cancelParams}
        setParams={context?.setCancelParams}
        exportExcel={{ fileName: `Danh-sach-don-huy-${fDateTime(Date.now())}` }}
        tabName="cancel"
        isFilterTag
        isFilterCreator
        isFilterDate
        isFilterSource
        isSearch
      />
    </div>
  ) : (
    <MCancel />
  );
};

export default Canceled;
