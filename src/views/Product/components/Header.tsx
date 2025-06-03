import Grid from "@mui/material/Grid";
import AddButton from "components/Buttons/AddButton";
import { GridWrapHeaderProps, HeaderWrapper } from "components/Table/Header";
import { BUTTON } from "constants/button";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import map from "lodash/map";
import { useState } from "react";
import { TProductFilterOptions } from "types/Product";
import { formatOptionSelect } from "utils/option";
import { filterChips } from "utils/product/filterChips";
import { filterOptions } from "utils/product/filterOptions";
import FormComboModal, { FormComboModalProps } from "./FormComboModal";
import { FormProductModalProps } from "./FormProductModal";

export interface HeaderProductProps
  extends Partial<
      Omit<
        GridWrapHeaderProps,
        | "filterChipCount"
        | "setFilterCount"
        | "onClearAll"
        | "onDelete"
        | "filterOptions"
        | "filterChipOptions"
      >
    >,
    FormProductModalProps,
    Omit<TProductFilterOptions, "category" | "supplier">,
    FormComboModalProps {
  isAddComboProduct?: boolean;
}

const Header = (props: HeaderProductProps) => {
  const { isAddComboProduct, params, onRefresh, setParams } = props;

  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const [openModal, setOpenModal] = useState<"product" | "combo" | "variant" | undefined>();
  const { category, supplier } = useAppSelector((state) => state.product.attributes);

  const categoryOptions = map(category, formatOptionSelect);
  const supplierOptions = map(supplier, formatOptionSelect);

  return (
    <HeaderWrapper
      {...props}
      rightChildren={
        <>
          {isAddComboProduct && (
            <Grid item>
              <FormComboModal
                onRefresh={onRefresh}
                open={openModal === "combo"}
                onClose={() => setOpenModal(undefined)}
              />
              <AddButton onClick={() => setOpenModal("combo")} label={BUTTON.CREATE_COMBO} />
            </Grid>
          )}
          {props.rightChildren}
        </>
      }
      filterOptions={filterOptions({
        ...props,
        category: categoryOptions,
        supplier: supplierOptions,
        params,
        users,
        setParams,
      })}
      filterChipOptions={filterChips({
        category: categoryOptions,
        supplier: supplierOptions,
        users,
      })}
    />
  );
};

export default Header;
