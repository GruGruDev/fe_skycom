import { SIMPLE_CELL_HEIGHT } from "constants/index";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useContext } from "react";
import { ProductContext } from "views/Product";
import ContainerVariant from "views/Product/components/ContainerVariant";
import MSimpleVariant from "./MSimpleVariant";

const SimpleVariant = () => {
  const { tableLayout } = useSettings();
  const context = useContext(ProductContext);
  const isDesktop = useResponsive("up", "sm");

  const tableProps =
    tableLayout === "group" ? context?.simpleVariant : context?.simpleVariantSimple;
  return isDesktop ? (
    <ContainerVariant
      tab="simple"
      {...tableProps}
      params={context?.variantParams}
      setParams={context?.setVariantParams}
      cellStyle={{ height: tableLayout === "group" ? 130 : SIMPLE_CELL_HEIGHT }}
    />
  ) : (
    <MSimpleVariant />
  );
};

export default SimpleVariant;
