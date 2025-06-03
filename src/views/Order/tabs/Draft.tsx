import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useContext } from "react";
import { fDateTime } from "utils/date";
import { OrderContext } from "views/Order";
import Container from "views/Order/components/Container";
import MDraft from "./MDraft";

const Draft = () => {
  const context = useContext(OrderContext);
  const { tableLayout } = useSettings();
  const isDesktop = useResponsive("up", "sm");

  const tableProps = tableLayout === "group" ? context?.draft : context?.draftSimple;

  return isDesktop ? (
    <div className="relative">
      <Container
        {...tableProps}
        params={context?.draftParams}
        exportExcel={{ fileName: `Danh-sach-don-nhap-${fDateTime(Date.now())}` }}
        setParams={context?.setDraftParams}
        tabName="draft"
        isFilterTag
        isFilterCreator
        isFilterSource
        isFilterDate
        isSearch
      />
    </div>
  ) : (
    <MDraft />
  );
};

export default Draft;
