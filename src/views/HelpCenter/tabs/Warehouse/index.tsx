import { Topics } from "views/HelpCenter/components/Topics";
import AddWarehouse from "./components/CreateWarehouse.mdx";
import ManagementWarehouse from "./components/ManagementWarehouse.mdx";
import DetailWarehouse from "./components/DetailProduc.mdx";
import ActionDetailProduct from "./components/ActionDetailProduct.mdx";
import ScanImport from "./components/ScanImport.mdx";
import ScanExport from "./components/ScanExport.mdx";
import AttributeWarehouse from "./components/AttributeWarehouse.mdx";

const components = {
  em(props: any) {
    return <i {...props} />;
  },
};

/* eslint-disable vietnamese/vietnamese-words */
export const WAREHOUSE_TAB = {
  name: "Warehouse",
  questions: [
    {
      title: "Để tạo mới kho hàng tôi cần làm gì?",
      desctiption: {
        contents: <AddWarehouse components={components}></AddWarehouse>,
      },
    },

    {
      title: "Tôi muốn kiểm tra và quản lý hàng hóa trong kho?",
      desctiption: {
        contents: <ManagementWarehouse components={components}></ManagementWarehouse>,
      },
    },
    {
      title: "Làm cách nào để Xem chi tiết sản phẩm trong Kho?",
      desctiption: {
        contents: <DetailWarehouse components={components}></DetailWarehouse>,
      },
    },
    {
      title: "Tôi có thể Nhập, Xuất, Chuyển và Kiểm kho tại trang chi tiết sản phẩm không ?",
      desctiption: {
        contents: <ActionDetailProduct components={components}></ActionDetailProduct>,
      },
    },
    {
      title: "Tính năng quét để xuất kho làm gì?",
      desctiption: {
        contents: <ScanExport components={components}></ScanExport>,
      },
    },
    {
      title: "Xử lý thế nào khi đơn hàng bị hoàn trả về?",
      desctiption: {
        contents: <ScanImport components={components}></ScanImport>,
      },
    },
    {
      title: "Làm sao để thiết lập các thuộc tính cho kho ?",
      desctiption: {
        contents: <AttributeWarehouse components={components}></AttributeWarehouse>,
      },
    },
  ],
};
const WarehouseHelpCenter = () => {
  return <Topics data={WAREHOUSE_TAB.questions} name={WAREHOUSE_TAB.name}></Topics>;
};

export default WarehouseHelpCenter;
