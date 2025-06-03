import { useContext } from "react";
import { WarehouseContext } from "..";
import WarehouseContainer from "../containers/WarehouseContainer";
import useSettings from "hooks/useSettings";

type Props = {};

const All = (_props: Props) => {
  const context = useContext(WarehouseContext);
  const { tableLayout } = useSettings();
  const tableProps = tableLayout === "group" ? context?.all : context?.allSimple;

  return (
    <WarehouseContainer
      {...tableProps}
      params={context?.allWarehouseParams}
      setParams={context?.setAllWarehouseParams}
      isAdd
      isFilterCreator
      isFilterCreatedDate
    />
  );
};

export default All;
