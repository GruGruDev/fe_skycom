import { useContext } from "react";
import { ProductContext } from "views/Product";
import ContainerVariant from "views/Product/components/ContainerVariant";

const AllVariant = () => {
  const context = useContext(ProductContext);

  return <ContainerVariant {...context?.tabAllVariant} tab="all" cellStyle={{ height: 160 }} />;
};

export default AllVariant;
