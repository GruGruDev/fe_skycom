import { useContext } from "react";

import Container from "views/Order/components/Container";
import { OrderContext } from "..";
import useSettings from "hooks/useSettings";
import { fDateTime } from "utils/date";
import useResponsive from "hooks/useResponsive";
import MAll from "./MAll";

const All = () => {
  const context = useContext(OrderContext);
  const isDesktop = useResponsive("up", "sm");

  const { tableLayout } = useSettings();

  const tableProps = tableLayout === "group" ? context?.all : context?.allSimple;

  return isDesktop ? (
    <div className="relative">
      <Container
        {...tableProps}
        params={context?.allParams}
        setParams={context?.setAllParams}
        exportExcel={{ fileName: `Danh-sach-don-hang-${fDateTime(Date.now())}` }}
        tabName="all"
        isFilterCarrierStatus
        isFilterTag
        isFilterOrderStatus
        isFilterCreator
        isFilterConfirmDate
        isFilterPaymentType
        isFilterDate
        isFilterSource
        isSearch
      />
    </div>
  ) : (
    <MAll />
  );
};

export default All;
