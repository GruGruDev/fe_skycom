import { SIMPLE_CELL_HEIGHT } from "constants/index";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useContext } from "react";
import { ProductContext } from "views/Product";
import ContainerProduct from "views/Product/components/ContainerProduct";
import MSimpleProduct from "./MSimpleProduct";

const SimpleProduct = () => {
  const context = useContext(ProductContext);
  const isDesktop = useResponsive("up", "sm");
  const { tableLayout } = useSettings();

  return isDesktop ? (
    <ContainerProduct
      tab="simple"
      {...context?.simpleProduct}
      cellStyle={{ height: tableLayout === "group" ? 130 : SIMPLE_CELL_HEIGHT }}
    />
  ) : (
    <MSimpleProduct />
  );
};

export default SimpleProduct;
