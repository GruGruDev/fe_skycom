import { Topics } from "views/HelpCenter/components/Topics";
import AddCategory from "./components/AddCategory.mdx";
import AddProducts from "./components/AddProducts.mdx";
import AddVariants from "./components/AddVariants.mdx";
import CreateProduct from "./components/CreateProduct.mdx";
import CreateVariant from "./components/CreateVariant.mdx";
import ManagementProduct from "./components/ManagementProduct.mdx";

const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */
export const PRODUCT_TAB = {
  name: "Product",
  questions: [
    {
      title: "Cách tải lên sản phẩm từ file excel?",
      desctiption: {
        contents: <AddProducts components={components}></AddProducts>,
      },
    },

    {
      title: "Cách để tải lên danh sách biến thể từ file excel?",
      desctiption: {
        contents: <AddVariants components={components}></AddVariants>,
      },
    },
    {
      title: "Muốn Tạo sản phẩm thủ công cần phải làm gì?",
      desctiption: {
        contents: <CreateProduct components={components}></CreateProduct>,
      },
    },
    {
      title: "Làm cách nào để tạo biến thể cho sản phẩm đã có sẵn trên hệ thống?",
      desctiption: {
        contents: <CreateVariant components={components}></CreateVariant>,
      },
    },
    {
      title: "Làm thế nào để Quản lý sản phẩm?",
      desctiption: {
        contents: <ManagementProduct components={components}></ManagementProduct>,
      },
    },
    {
      title: "Tôi muốn thiết lập Danh mục sản phẩm cần phải làm thế nào?",
      desctiption: {
        contents: <AddCategory components={components}></AddCategory>,
      },
    },
  ],
};
const ProductHelpCenter = () => {
  return <Topics data={PRODUCT_TAB.questions} name={PRODUCT_TAB.name}></Topics>;
};

export default ProductHelpCenter;
