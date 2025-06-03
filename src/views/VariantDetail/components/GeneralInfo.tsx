import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { productApi } from "apis/product";
import { warehouseApi } from "apis/warehouse";
import { MButton } from "components/Buttons";
import { TagField } from "components/Fields";
import SheetModal from "components/Sheet/SheetModal";
import { Span } from "components/Texts";
import { BUTTON } from "constants/button";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { PRODUCT_LABEL } from "constants/product/label";
import { ROLE_PRODUCT, ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { SHEET_TYPE_VALUE } from "constants/warehouse";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import useResponsive from "hooks/useResponsive";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { productServices } from "services/product";
import { TAttribute } from "types/Attribute";
import { STATUS_PRODUCT_LABEL, TBatch, TVariantDetail, VariantDTO } from "types/Product";
import { SheetModalType, TSheetDetail } from "types/Sheet";
import { fNumber, formatFloatToString } from "utils/number";
import { formatOptionAttribute } from "utils/option";
import { checkPermission } from "utils/roleUtils";
import { showSuccess } from "utils/toast";
import { FormVariantModal } from "views/Product/components/FormVariantModal";
import { ImageCarousel } from "views/VariantDetail/components/ImageCarousel";

interface ProductInfoProps {
  variant?: Partial<TVariantDetail>;
  onRefresh?: () => void;
  handleAddBatch: (batch: TBatch) => void;
  handleUpdateBatch: (batch: TBatch, index: number) => void;
  onUpdateVariant: React.Dispatch<React.SetStateAction<Partial<TVariantDetail | undefined>>>;
  batches?: TBatch[];
}

const GeneralInfo = ({
  variant = {},
  onRefresh,
  batches = [],
  handleAddBatch,
  handleUpdateBatch,
  onUpdateVariant,
}: ProductInfoProps) => {
  const theme = useTheme();
  const { user } = useAuth();
  const isDeskop = useResponsive("up", "sm");

  const { tags } = useAppSelector(getDraftSafeSelector("product")).attributes;

  const [updateModal, setUpdateModal] = useState(false);
  const [sheetModal, setSheetModal] = useState<Partial<SheetModalType>>({
    isOpen: false,
  });

  const handleUpdateVariant = async (form: Partial<VariantDTO>) => {
    const res = await productServices.handleUpdateVariant(form);
    if (res) {
      const resTags = tags.filter((item) => res.tags?.includes(item.id || ""));
      onUpdateVariant({ ...res, tags: resTags });
    }
    return res;
  };

  const addBatch = async (name: string) => {
    const res = await productApi.create<TBatch>({
      params: { name, product_variant: variant.id },
      endpoint: "batches/",
    });
    if (res.data) {
      handleAddBatch(res.data);
      showSuccess(RESPONSE_MESSAGES.CREATE_SUCCESS);
      return res.data;
    }
    return null;
  };

  const onUpdateBatchDefault = async (batch: { id: string; value: boolean; index: number }) => {
    const { id, index, value } = batch;
    if (id && value) {
      const res = await productApi.update<TBatch>({
        params: { is_default: true },
        endpoint: `batches/${id}/`,
      });
      if (res.data) {
        handleUpdateBatch(res.data, index);
        return res.data;
      }
      return null;
    }
  };

  const getInventory = useCallback(async () => {
    if (batches?.length) {
      const batchIds: string[] = reduce(
        batches,
        (prev: string[], cur) => {
          return [...prev, cur.id];
        },
        [],
      );
      const res = await warehouseApi.get<TSheetDetail>({
        endpoint: "inventory-with-variant/",
        params: { batch: batchIds },
      });
      if (res.data) {
        const sheet = res.data.results[0];
        onUpdateVariant((prev) => ({ ...prev, ...sheet }));
      }
    }
  }, [batches, onUpdateVariant]);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  const isAddVariant = checkPermission(
    user?.role?.data?.[ROLE_TAB.PRODUCT]?.[ROLE_PRODUCT.HANDLE],
    user,
  ).isReadAndWrite;

  const isImportSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isExportSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isTransferSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
    user,
  ).isReadAndWrite;
  const isCheckingSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
    user,
  ).isReadAndWrite;

  const variantPropsMemo = useMemo(() => {
    return [variant];
  }, [variant]);

  return (
    <Grid container spacing={2}>
      {isAddVariant && (
        <FormVariantModal
          handleSubmitModal={handleUpdateVariant}
          open={updateModal}
          onClose={() => setUpdateModal(false)}
          row={variant}
          onRefresh={onRefresh}
        />
      )}

      <SheetModal
        open={sheetModal.isOpen}
        defaultType={sheetModal.type}
        onClose={() => setSheetModal({ isOpen: false })}
        variants={variantPropsMemo}
        fullScreen={!isDeskop}
      />

      <Grid item xs={12}>
        <Stack spacing={1} display="flex" direction="row" justifyContent={"end"}>
          <MButton
            color="warning"
            onClick={() => setSheetModal({ ...sheetModal, isOpen: true, type: "IP" })}
            disabled={!isImportSheet}
          >
            <Typography fontSize={"0.825rem"}>{SHEET_TYPE_VALUE["IP"]}</Typography>
          </MButton>
          <MButton
            color="warning"
            onClick={() => setSheetModal({ ...sheetModal, isOpen: true, type: "EP" })}
            disabled={!isExportSheet}
          >
            <Typography fontSize={"0.825rem"}>{SHEET_TYPE_VALUE["EP"]}</Typography>
          </MButton>
          <MButton
            color="warning"
            onClick={() => setSheetModal({ ...sheetModal, isOpen: true, type: "TF" })}
            disabled={!isTransferSheet}
          >
            <Typography fontSize={"0.825rem"}>{SHEET_TYPE_VALUE["TF"]}</Typography>
          </MButton>
          <MButton
            color="warning"
            onClick={() => setSheetModal({ ...sheetModal, isOpen: true, type: "CK" })}
            disabled={!isCheckingSheet}
          >
            <Typography fontSize={"0.825rem"}>{SHEET_TYPE_VALUE["CK"]}</Typography>
          </MButton>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={3} sx={{ display: { sm: "none", md: "block" } }}>
        <ImageCarousel images={variant.images} />
      </Grid>
      <Grid item xs={12} md={6} lg={9}>
        <Stack
          display="flex"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
          sx={{ flexDirection: { xs: "column-reverse", md: "row" } }}
        >
          <Box>
            <Span
              style={styles.status}
              variant={theme.palette.mode === "light" ? "ghost" : "filled"}
              color={variant?.is_active ? "success" : "error"}
            >
              {variant?.is_active
                ? PRODUCT_LABEL[STATUS_PRODUCT_LABEL.active]
                : PRODUCT_LABEL[STATUS_PRODUCT_LABEL.inactive]}
            </Span>
            <Typography component="h5" fontSize="1rem" fontWeight="bold">
              {variant?.name}
            </Typography>
          </Box>

          <Stack spacing={1} display="flex" direction="row">
            <MButton
              color="secondary"
              onClick={() => setUpdateModal(true)}
              disabled={!isAddVariant}
            >
              {BUTTON.EDIT}
            </MButton>
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          <Grid container spacing={1}>
            <DetailItem label={`${PRODUCT_LABEL.SKU_code}:`} content={variant?.SKU_code} />
            <DetailItem label={`${PRODUCT_LABEL.bar_code}:`} content={variant?.bar_code} />
            <DetailItem
              label={`${PRODUCT_LABEL.neo_price}:`}
              content={fNumber(variant?.neo_price)}
            />
            <DetailItem
              label={`${PRODUCT_LABEL.sale_price}:`}
              content={fNumber(variant?.sale_price)}
            />
            <DetailItem
              label={`${PRODUCT_LABEL.total_inventory}:`}
              content={fNumber(variant?.total_inventory)}
            />
            <DetailItem
              label={`${PRODUCT_LABEL.quantity_non_confirm}:`}
              content={formatFloatToString(variant?.quantity_non_confirm)}
            />
            <DetailItem
              label={`${PRODUCT_LABEL.quantity_confirm}:`}
              content={formatFloatToString(variant?.quantity_confirm)}
            />
            <DetailItem label={`${PRODUCT_LABEL.variant_note}:`} content={variant?.note} />
          </Grid>
          <Grid container spacing={1}>
            <DetailItem
              label={`${PRODUCT_LABEL.tags}:`}
              content={
                <TagField
                  disabled={!isAddVariant}
                  options={map(tags, (item) => formatOptionAttribute(item, "id", "tag"))}
                  // disabled
                  inputStyle={styles.batchSelector}
                  placeholder={PRODUCT_LABEL.tags}
                  onSubmit={(values) =>
                    handleUpdateVariant({ id: variant.id, tags: values as string[] })
                  }
                  value={map(variant?.tags, "id") as TAttribute[]}
                  returnType="id"
                  size="small"
                />
              }
            />
            <DetailItem
              label={`${PRODUCT_LABEL.batche_list}:`}
              content={
                <TagField
                  disabled={!isAddVariant}
                  options={batches as TAttribute[]}
                  // disabled
                  inputStyle={styles.batchSelector}
                  placeholder={PRODUCT_LABEL.batch}
                  // onSubmit={}
                  onCreateTag={async (option) => {
                    return option.name ? await addBatch(option.name?.toString()) : null;
                  }}
                  value={batches}
                  onChangeDefault={onUpdateBatchDefault}
                  size="small"
                />
              }
            />
          </Grid>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default GeneralInfo;

const styles = {
  status: { width: "fit-content", marginTop: "8px" },
  batchSelector: { minWidth: 180 },
};

const DetailItem = ({
  label,
  content,
}: {
  label: string;
  content?: React.ReactNode | JSX.Element | string | number | null;
}) => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={6} xl={6} display="flex" alignItems="start">
      <FormLabel
        sx={{ paddingRight: "8px", fontSize: "0.82rem", color: "text.primary", minWidth: 100 }}
      >
        {label}
      </FormLabel>
      {typeof content === "string" || typeof content === "number" ? (
        <Typography fontSize="0.82rem" sx={{ fontWeight: 600 }}>
          {content}
        </Typography>
      ) : (
        content
      )}
    </Grid>
  );
};
