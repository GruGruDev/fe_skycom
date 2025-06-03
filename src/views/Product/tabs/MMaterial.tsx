import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { productApi } from "apis/product";
import { LABEL } from "constants/label";
import { PRODUCT_LABEL } from "constants/product/label";
import MTableWrapper from "components/Table/MTableWrapper";
import { useCancelToken } from "hooks/useCancelToken";
import { useCallback, useContext, useState } from "react";
import { productServices } from "services/product";
import { TParams } from "types/Param";
import { TProductMaterial } from "types/Product";
import { fNumber, formatFloatToString } from "utils/number";
import { redirectMaterialUrl } from "utils/product/redirectUrl";
import { FormMaterialModal } from "../components/FormMaterialModal";
import FilterComponent from "../components/FilterComponent";
import { MATERIAL_SORT_OPTIONS } from "constants/product/material";
import AddButton from "components/Buttons/AddButton";
import { BUTTON } from "constants/button";
import HandlerImage from "components/Images/HandlerImage";
import { ProductContext } from "..";

const MMaterial = () => {
  const { tabMSimpleMaterial } = useContext(ProductContext);
  const { params, setParams } = tabMSimpleMaterial || {};

  const { newCancelToken } = useCancelToken([params]);
  const [open, setOpen] = useState(false);

  const handleAddMaterial = async (form: Partial<TProductMaterial>) => {
    const res = await productServices.handleAddMaterial(form);
    if (res) {
      getData?.();
    }
    return res;
  };

  const getData = useCallback(
    async (params?: TParams) => {
      const result = await productApi.get<TProductMaterial>({
        params: { ...params, cancelToken: newCancelToken() },
        endpoint: "materials/",
      });

      return result;
    },
    [newCancelToken],
  );

  return (
    <MTableWrapper
      searchPlaceholder={PRODUCT_LABEL.search_material}
      setParams={setParams}
      params={params}
      itemComponent={(item, index) => (
        <Box key={index}>
          <MMatialItem
            material={item}
            onRefresh={() => setParams?.({ ...params, page: 1 })}
            activeModal
          />
        </Box>
      )}
      onGetData={getData}
      onSearch={(value) => setParams?.({ ...params, search: value, page: 1 })}
      filterComponent={<FilterComponent isFilterActive setParams={setParams} params={params} />}
      orderingOptions={MATERIAL_SORT_OPTIONS}
      rightHeaderChildren={
        <>
          <FormMaterialModal
            handleSubmitModal={handleAddMaterial}
            onClose={() => setOpen(false)}
            onRefresh={() => setParams?.({ ...params, page: 1 })}
            open={open}
          />
          <AddButton onClick={() => setOpen(true)} label={BUTTON.ADD} />
        </>
      }
      itemHeight={105}
    />
  );
};

export default MMaterial;

export const MMatialItem = ({
  material,
  onRefresh,
  activeModal,
}: {
  material: Partial<TProductMaterial>;
  onRefresh?: () => void;
  activeModal?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const handleUpdateMaterial = async (form: Partial<TProductMaterial>) => {
    const res = await productServices.handleUpdateMaterial(form);
    if (res) {
      setOpen(false);
      onRefresh?.();
    }
    return res;
  };

  return (
    <Paper elevation={1} sx={{ p: 1, position: "relative" }}>
      {activeModal && (
        <FormMaterialModal
          handleSubmitModal={handleUpdateMaterial}
          onClose={() => setOpen(false)}
          onRefresh={onRefresh}
          open={open}
          row={material}
        />
      )}
      <Stack direction={"row"} alignItems={"center"} gap={1} onClick={() => setOpen(true)}>
        <Box>
          <HandlerImage value={material?.images} height={"5rem"} width={"5rem"} preview />
        </Box>
        <Box>
          <Typography fontSize={"0.825rem"} color={material.is_active ? "primary" : "error"}>
            {material.name}
          </Typography>
          <Button
            variant="contained"
            sx={{ maxHeight: 25, position: "absolute", top: 3, right: 3 }}
          >
            <Link
              href={`${document.location.origin}${redirectMaterialUrl(material?.id)}`}
              onClick={(e) => e.stopPropagation()}
              component={"a"}
              color="text.primary"
              fontSize={"0.7rem"}
            >
              {`${LABEL.DETAIL}`}
            </Link>
          </Button>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Typography fontSize={"0.7rem"}>{material.SKU_code}</Typography>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Typography fontSize={"0.7rem"}>{`${PRODUCT_LABEL.total_inventory} ${fNumber(
              material.total_inventory,
            )}`}</Typography>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack>
              <Typography fontSize={"0.7rem"} color="grey">
                {PRODUCT_LABEL.weight}
              </Typography>
              <Typography fontSize={"0.825rem"}>{formatFloatToString(material.weight)}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
