import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { productApi } from "apis/product";
import AddButton from "components/Buttons/AddButton";
import MTableWrapper from "components/Table/MTableWrapper";
import { BUTTON } from "constants/button";
import { CURRENCY_UNIT } from "constants/index";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import { VARIANT_SORT_OPTIONS } from "constants/product/variant";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import reduce from "lodash/reduce";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { productServices } from "services/product";
import { TDGridData } from "types/DGrid";
import { IMAGE_TYPE, TImage } from "types/Media";
import { TParams } from "types/Param";
import { TVariant, VariantDTO } from "types/Product";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { fDateTime } from "utils/date";
import { fNumber, fPercent } from "utils/number";
import { formatOptionSelect } from "utils/option";
import VariantDetail from "views/VariantDetail";
import DrawerFilterContent from "../components/DrawerFilterContent";
import FilterComponent from "../components/FilterComponent";
import { FormVariantModal } from "../components/FormVariantModal";
import HistoryImportExportModal from "../components/HistoryImportExportModal";
import InventoryModal from "../components/InventoryModal";
import HandlerImage from "components/Images/HandlerImage";
import useRouteParams from "hooks/useRouteParams";
import { ProductContext } from "..";

const MSimpleVariant = () => {
  const routeParams = useRouteParams();
  const { category } = useAppSelector(getDraftSafeSelector("product")).attributes;
  const { tabMSimpleVariant } = useContext(ProductContext);
  const { params, setParams } = tabMSimpleVariant || {};

  const { newCancelToken } = useCancelToken([params]);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState<TDGridData<Partial<TVariant>>>({
    data: [],
    loading: false,
    count: 0,
  });

  const getVariants = useCallback(
    async (params?: TParams) => {
      const result = await productApi.get<TVariant>({
        params: { ...params, cancelToken: newCancelToken() },
        endpoint: "variants/",
      });

      return result;
    },
    [newCancelToken],
  );

  const onAddImage = (image: TImage, index: number) => {
    const dataClone = [...data.data];
    dataClone[index].images = [image, ...(dataClone[index].images || [])];
    setData((prev) => ({ ...prev, data: dataClone }));
  };

  const handleAddVariant = async (form: Partial<VariantDTO>) => {
    if (form.product) {
      const res = await productServices.handleAddVariant({ ...form, product_id: form.product });
      if (res) {
        setParams?.({ ...params, page: 1 });
      }
      return res;
    }
  };

  useEffect(() => {
    setParams?.((prev) => ({ ...prev, ...routeParams }));
  }, [routeParams, setParams]);

  const categoryOptions = useMemo(() => {
    return reduce(category, (prev: TSelectOption[], cur) => [...prev, formatOptionSelect(cur)], []);
  }, [category]);

  return (
    <MTableWrapper
      searchPlaceholder={PRODUCT_LABEL.search_variant}
      setParams={setParams}
      params={params}
      itemComponent={(item, index) => {
        return (
          <Box key={index}>
            <MVariantItem
              variant={item}
              onRefresh={() => setParams?.({ ...params, page: 1 })}
              activeModal
              onAddImage={(image) => onAddImage(image, index)}
            />
          </Box>
        );
      }}
      itemHeight={156}
      onGetData={getVariants}
      onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
      filterComponent={
        <FilterComponent
          isFilterActive
          isFilterCategory
          category={categoryOptions}
          setParams={setParams}
          params={params}
        />
      }
      rightHeaderChildren={
        <>
          <FormVariantModal
            onRefresh={() => setParams?.({ ...params, page: 1 })}
            open={open}
            onClose={() => setOpen(false)}
            handleSubmitModal={handleAddVariant}
            isSelectProduct
          />
          <AddButton onClick={() => setOpen(true)} label={BUTTON.ADD} />
        </>
      }
      orderingOptions={VARIANT_SORT_OPTIONS}
      filterDrawer={(params, setParams) => (
        <DrawerFilterContent
          categoryOptions={categoryOptions}
          params={params}
          setParams={setParams}
        />
      )}
    />
  );
};

export default MSimpleVariant;

const styles: TStyles<"priceChip"> = {
  priceChip: { fontSize: "0.7rem" },
};

export const MVariantItem = ({
  variant,
  onRefresh,
  activeModal,
  onAddImage,
}: {
  variant: Partial<TVariant>;
  onRefresh?: () => void;
  activeModal?: boolean;
  onAddImage?: (image: TImage) => void;
}) => {
  const [open, setOpen] = useState<"variant" | "sheet" | "inventory" | "detail" | null>(null);

  const handleUpdateVariant = async (form: Partial<VariantDTO>) => {
    const res = await productServices.handleUpdateVariant(form);
    if (res) {
      setOpen(null);
      onRefresh?.();
    }
    return res;
  };

  return (
    <Paper elevation={1} sx={{ p: 1, position: "relative" }}>
      <Drawer anchor={"right"} open={open === "detail"} onClose={() => setOpen(null)}>
        <VariantDetail variantId={variant.id} onClose={() => setOpen(null)} />
        <Button
          onClick={() => setOpen(null)}
          variant="contained"
          color="error"
          sx={{ position: "fixed", right: 20, bottom: 50 }}
        >
          {LABEL.CLOSE}
        </Button>
      </Drawer>
      <Stack spacing={0.5}>
        {activeModal && (
          <FormVariantModal
            handleSubmitModal={handleUpdateVariant}
            onClose={() => setOpen(null)}
            onRefresh={onRefresh}
            open={open === "variant"}
            row={variant}
          />
        )}

        {activeModal && (
          <HistoryImportExportModal
            onClose={() => setOpen(null)}
            open={open === "sheet"}
            variantId={variant.id}
          />
        )}
        {activeModal && (
          <InventoryModal
            onClose={() => setOpen(null)}
            open={open === "inventory"}
            variantId={variant.id}
          />
        )}
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"end"}
          spacing={0.5}
          sx={{ button: { padding: "0px 8px !important" } }}
        >
          <Button variant="contained" color="info" onClick={() => setOpen("inventory")}>
            <Typography fontSize={"0.7rem"}>{PRODUCT_LABEL.inventory}</Typography>
          </Button>

          <Button variant="contained" color="info" onClick={() => setOpen("sheet")}>
            <Typography fontSize={"0.7rem"}>{PRODUCT_LABEL.import_export_history}</Typography>
          </Button>

          <Button variant="contained" onClick={() => setOpen("detail")}>
            <Typography fontSize={"0.7rem"}>{LABEL.DETAIL}</Typography>
          </Button>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} gap={1} onClick={() => setOpen("variant")}>
          <Box>
            <HandlerImage
              value={variant.images}
              height={"5rem"}
              width={"5rem"}
              preview
              params={{ type: IMAGE_TYPE.PDV, product_variant: variant.id }}
              onAddImage={onAddImage}
            />
          </Box>
          <Stack spacing={1}>
            <Typography fontSize={"0.825rem"} color={variant.is_active ? "primary" : "error"}>
              {variant.name}
            </Typography>
            <Typography fontSize={"0.7rem"} lineHeight={0}>
              SKU: {variant.SKU_code}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Stack>
                <Typography fontSize={"0.7rem"} color="grey">
                  {PRODUCT_LABEL.total_inventory}
                </Typography>
                <Typography fontSize={"0.825rem"}>{fNumber(variant.total_inventory)}</Typography>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Stack>
                <Typography fontSize={"0.7rem"} color="grey">
                  {PRODUCT_LABEL.commission_value}
                </Typography>
                <Typography fontSize={"0.825rem"} height={20}>
                  {variant.commission ? fNumber(variant.commission) : null}
                  {variant.commission_percent
                    ? fPercent((variant.commission_percent || 0) / 100)
                    : null}
                </Typography>
              </Stack>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Stack>
                <Typography fontSize={"0.7rem"} color="grey">
                  {PRODUCT_LABEL.total_weight}
                </Typography>
                <Typography fontSize={"0.825rem"}>
                  {variant.total_weight && fNumber(variant.total_weight)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
          {variant.category_name && (
            <Chip
              size={"small"}
              label={variant.category_name}
              color="info"
              style={styles.priceChip}
            />
          )}
          <Chip
            size={"small"}
            label={`${fNumber(variant.sale_price)} ${CURRENCY_UNIT.VND}`}
            color="info"
            style={styles.priceChip}
          />
          <Chip
            size={"small"}
            label={fDateTime(variant.modified)}
            color="default"
            style={styles.priceChip}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};
