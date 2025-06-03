import { useContext } from "react";
import { ProductContext } from "views/Product";
import ContainerProduct from "views/Product/components/ContainerProduct";

const AllProduct = () => {
  const context = useContext(ProductContext);

  return (
    <ContainerProduct
      {...context?.tabAllProduct}
      isAddComboProduct
      tab="all"
      cellStyle={{ height: 80 }}
    />
  );
};

export default AllProduct;
