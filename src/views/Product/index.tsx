import BallotIcon from "@mui/icons-material/Ballot";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ViewComfyAltIcon from "@mui/icons-material/ViewComfyAlt";
import { TabRouteWrap } from "components/Tabs";
import { PAGE_TITLE } from "constants/pageTitle";
import { createContext } from "react";
import { PATH_DASHBOARD } from "routers/paths";
import { PRODUCT_PATH, ROOT_PATH } from "types/Router";
import { AllProductContext, useAllProductContext } from "./contexts/AllProduct";
import { AllVariantContext, useAllVariantContext } from "./contexts/AllVariant";
import { ComboProductContext, useComboProductContext } from "./contexts/Combo";
import { SimpleProductContext, useSimpleProductContext } from "./contexts/SimpleProduct";
import { SimpleVariantContext, useSimpleVariantContext } from "./contexts/SimpleVariant";
import { MaterialContext, useMaterialContext } from "./contexts/Material";

const ProductPage = () => {
  const PRODUCT_TABS = [
    {
      label: PAGE_TITLE.product.list[PRODUCT_PATH.CATEGORY],
      path: `/${PATH_DASHBOARD.product.list[PRODUCT_PATH.CATEGORY]}`,
      icon: <CategoryIcon />,
    },
    {
      label: PAGE_TITLE.product.list[PRODUCT_PATH.SIMPLE_PRODUCT],
      path: `/${PATH_DASHBOARD.product.list[PRODUCT_PATH.SIMPLE_PRODUCT]}`,
      icon: <BallotIcon />,
    },
    {
      label: PAGE_TITLE.product.list[PRODUCT_PATH.SIMPLE_VARIANT],
      path: `/${PATH_DASHBOARD.product.list[PRODUCT_PATH.SIMPLE_VARIANT]}`,
      icon: <Inventory2Icon />,
    },
    {
      label: PAGE_TITLE.product.list[PRODUCT_PATH.MATERIAL],
      path: `/${PATH_DASHBOARD.product.list[PRODUCT_PATH.MATERIAL]}`,
      icon: <VaccinesIcon />,
    },
    {
      label: PAGE_TITLE.product.list.combo,
      path: `/${PATH_DASHBOARD.product.list.combo}`,
      icon: <ViewComfyAltIcon />,
    },
  ];

  return <TabRouteWrap routes={PRODUCT_TABS} title={`${PAGE_TITLE.product.list[ROOT_PATH]}`} />;
};

export type ProductContextType = Partial<
  AllProductContext &
    ComboProductContext &
    SimpleProductContext &
    AllVariantContext &
    SimpleVariantContext &
    MaterialContext
>;

export const ProductContext = createContext<ProductContextType>({});

const Product = () => {
  return (
    <ProductContext.Provider
      value={{
        ...useAllProductContext(),
        ...useComboProductContext(),
        ...useSimpleProductContext(),
        ...useAllVariantContext(),
        ...useSimpleVariantContext(),
        ...useMaterialContext(),
      }}
    >
      <ProductPage />
    </ProductContext.Provider>
  );
};

export default Product;
