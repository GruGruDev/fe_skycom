import { SIMPLE_CELL_HEIGHT } from "constants/index";
import useResponsive from "hooks/useResponsive";
import useSettings from "hooks/useSettings";
import { useContext } from "react";
import { ProductContext } from "views/Product";
import ContainerMaterial from "views/Product/components/ContainerMaterial";
import MMaterial from "./MMaterial";

const Material = () => {
  const { tableLayout } = useSettings();
  const context = useContext(ProductContext);
  const isDesktop = useResponsive("up", "sm");

  const tableProps = tableLayout === "group" ? context?.material : context?.materialSimple;
  return isDesktop ? (
    <ContainerMaterial
      {...tableProps}
      params={context?.materialParams}
      setParams={context?.setMaterialParams}
      cellStyle={{ height: tableLayout === "group" ? 130 : SIMPLE_CELL_HEIGHT }}
    />
  ) : (
    <MMaterial />
  );
};

export default Material;
