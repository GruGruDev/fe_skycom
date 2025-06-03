import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { orderApi } from "apis/order";
import { warehouseApi } from "apis/warehouse";
import { BUTTON } from "constants/button";
import { ORDER_STATUS_VALUE } from "constants/order";
import { ORDER_LABEL } from "constants/order/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import reduce from "lodash/reduce";
import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routers/paths";
import { OrderDTOV2, OrderLineItemDTO, TOrderPayload } from "types/Order";
import { TSheet, TSheetDetail, TSheetDetailPayload, TSheetPayload } from "types/Sheet";
import { TSx } from "types/Styles";
import { TInventory } from "types/Warehouse";
import { dirtyRHF } from "utils/formValidation";
import { handleNotifyErrors } from "utils/handleError";
import { calcOrderPriceWhileChangeVariant } from "utils/order/calcOrderPriceWhileChangeVariant";
import { handleCaclCrossSale } from "utils/order/handleCalcCrossSale";
import { handleCheckInventory } from "utils/order/handleCheckInventory";
import { handleFormatFormToPayload } from "utils/order/handleFormatFormToPayload";
import { handleFormatResToForm } from "utils/order/handleFormatResToForm";
import { orderSchema } from "validations/order";
import { OrderContext } from "views/Order";
import BottomPanel from "./BottomPanel";
import ConfirmVariantModal from "./ConfirmVariantModal";
import Customer from "./Customer";
import General from "./General";
import HeaderAction from "./HeaderAction";
import HeaderPanel from "./HeaderPanel";
import HistoryTimeline from "./HistoryTimeline";
import LineItem from "./LineItem";
import OrderPrice from "./OrderPrice";
import { showError } from "utils/toast";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { getApiSheetEndpoint } from "utils/warehouse/getApiSheetEndpoint";

const ORDER_DEFAULT: Partial<OrderDTOV2> = {
  // delivery_note: "",
  is_cross_sale: false,
  line_items: [],
  name_shipping: "",
  payments: [{ type: "COD", price_from_order: 0 }],
  phone_shipping: "",
  appointment_date: null,
  // sale_note: "",
  status: "draft",
  id: "",
  is_available_shipping: false,
};

interface Props {
  onClose?: () => void;
  row?: Partial<OrderDTOV2>;
  defaultValues?: Partial<OrderDTOV2>;
  onApplyChangesWhenCreateOrderByLead?: (order: Partial<OrderDTOV2>) => void;
}
let CACHE_ORDER: Partial<OrderDTOV2> | undefined;

const OrderForm = (props: Props) => {
  const { row, onClose, defaultValues, onApplyChangesWhenCreateOrderByLead } = props;
  const orderContext = useContext(OrderContext);
  const { warehouseIds } = useAppSelector(getDraftSafeSelector("warehouses"));
  const { newCancelToken } = useCancelToken();
  const navigate = useNavigate();

  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [listInventoryInOrder, setListInventoryInOrder] = useState<{
    [key: string]: TInventory[];
  }>({});
  const [listInventory, setListInventory] = useState<TSheetDetail[]>([]);

  const {
    reset,
    clearErrors,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<OrderDTOV2>({
    resolver: yupResolver(orderSchema) as Resolver<any, any>,
    //data ban đầu khi tạo đơn ở lead
    defaultValues,
  });

  const {
    line_items = [],
    payments,
    status,
    address_shipping,
    customer,
    order_key,
    phone_shipping,
    name_shipping,
    complete_time,
    id,
  } = watch();

  const sheetEndpoint = getApiSheetEndpoint("EP");

  const handleImportSheet = async () => {
    const res = await warehouseApi.get<TSheet>({
      params: { page: 1, limit: 10, order_id: id, type: "EP" },
      endpoint: sheetEndpoint,
    });
    if (res.data) {
      const { results = [] } = res.data;
      const sheet = results[0];
      if (sheet?.is_confirm) {
        const sheetDetail = await warehouseApi.getById({
          endpoint: `${sheetEndpoint}${sheet.id}/`,
        });
        if (sheetDetail.data) {
          return await handleCreateSheetImport(sheetDetail.data);
        }
        return false;
      }
      return true;
    }
    return true;
  };

  const handleCreateSheetImport = async (form: Partial<TSheetDetail> = {}) => {
    const { sheet_detail, warehouse, change_reason } = form;

    const sheetDetails = reduce(
      sheet_detail,
      (prev: Partial<TSheetDetailPayload>[], cur) => {
        const { product_variant_batch, quantity = 0 } = cur;

        const switchTypeQuantity = Number.isInteger(quantity)
          ? parseInt(quantity.toString())
          : quantity;

        const sheet = [
          ...prev,
          {
            product_variant_batch: product_variant_batch?.id,
            quantity: Math.abs(switchTypeQuantity),
          },
        ];
        return sheet;
      },
      [],
    );

    const payload: Partial<TSheetPayload> = {
      is_confirm: true,
      sheet_detail: sheetDetails.length ? sheetDetails : undefined,
      type: "IP",
      order_key,
      warehouse: warehouse?.id,
      change_reason: change_reason?.id,
    };

    const res = await warehouseApi.create({
      params: { ...payload, is_confirm: true },
      endpoint: sheetEndpoint,
    });
    if (res.data) {
      return true;
    }
    return false;
  };

  const handleSubmitCancelOrder = async (cancelReasonId: string) => {
    setLoading(true);
    const defaultStatus = row?.status;
    if (defaultStatus === "completed") {
      const resImportSheet = await handleImportSheet();
      if (!resImportSheet) {
        showError(RESPONSE_MESSAGES.IMPORT_SHEET_ERROR);
        setLoading(false);
        return;
      }
    }

    const result = await orderApi.update<OrderDTOV2>({
      params: { status: ORDER_STATUS_VALUE.cancel, cancel_reason: cancelReasonId },
      endpoint: `${row?.id}/`,
    });
    if (result?.data) {
      // tạo phiếu nhập đối với phiếu xuất đã xác nhận
      onApplyChangesWhenCreateOrderByLead?.(result?.data);
      onApplyChangesWhenCreateOrderByLead
        ? onClose?.()
        : navigate(`/${PATH_DASHBOARD.orders.list[status]}`);
    }
    setLoading(false);
  };

  const handleUpdateOrder = async (order: Partial<TOrderPayload>) => {
    setLoading(true);

    const params = dirtyRHF(order, dirtyFields);

    const result = await orderApi.update<OrderDTOV2>({
      params,
      endpoint: `${row?.id}/`,
    });
    if (result?.data) {
      onApplyChangesWhenCreateOrderByLead?.(result?.data);
      onApplyChangesWhenCreateOrderByLead
        ? onClose?.()
        : navigate(`/${PATH_DASHBOARD.orders.list[status]}`);
    }
    setLoading(false);
  };

  const handleCreateOrder = async (order: Partial<TOrderPayload>) => {
    setLoading(true);

    const result = await orderApi.create<OrderDTOV2>({
      params: order,
      endpoint: "",
    });
    if (result?.data) {
      // tạo phiếu kho

      // cập nhật trạng thái form
      if (onApplyChangesWhenCreateOrderByLead) {
        onApplyChangesWhenCreateOrderByLead?.(result?.data);
        onClose?.();
        setLoading(false);
        return;
      }
      CACHE_ORDER = ORDER_DEFAULT;
      reset(ORDER_DEFAULT);
      setLoading(false);
    }
  };

  const getOrderByID = useCallback(async () => {
    if (row?.id) {
      setLoading(true);

      const resOrder = await orderApi.getById<OrderDTOV2>({
        endpoint: `${row?.id}/`,
        params: { cancelToken: newCancelToken() },
      });
      if (resOrder?.data) {
        const orderFormData = handleFormatResToForm(resOrder?.data);

        CACHE_ORDER = orderFormData;

        reset(orderFormData);
      }
      setLoading(false);
    }
  }, [newCancelToken, reset, row?.id]);

  const resetPayment = () => {
    setValue("price_pre_paid", 0, { shouldDirty: true });
    setValue("price_addition_input", 0, { shouldDirty: true });
    setValue("price_discount_input", 0, { shouldDirty: true });
    setValue("price_delivery_input", 0, { shouldDirty: true });
    setValue("price_total_discount_order_promotion", 0, { shouldDirty: true });
    setValue("payments", [], { shouldDirty: true });
  };

  const handleChangeVariants = (variants: Partial<OrderLineItemDTO>[]) => {
    const { crossSaleValue, isCrossSale } = handleCaclCrossSale(variants);
    const { isDenyConfirm } = handleCheckInventory({
      lineItems: variants,
      listInventory,
      listInventoryInOrder,
      warehouseIds,
    });
    // cập nhật lại crosssale value
    setValue<keyof OrderDTOV2>("is_cross_sale", isCrossSale, { shouldDirty: true });
    setValue<keyof OrderDTOV2>("value_cross_sale", crossSaleValue, { shouldDirty: true });
    //khi cập nhật sản phẩm mà kho không có hàng thì set đơn lại thành đơn hẹn
    isDenyConfirm && setValue<keyof OrderDTOV2>("status", "draft");

    // tính lại order price
    const {
      price_total_variant_actual,
      price_total_variant_all,
      price_total_order_actual,
      price_total_variant_actual_input,
    } = calcOrderPriceWhileChangeVariant(variants);

    setValue("price_total_variant_actual", price_total_variant_actual, { shouldDirty: true });
    setValue("price_total_variant_actual_input", price_total_variant_actual_input, {
      shouldDirty: true,
    });
    setValue("price_total_variant_all", price_total_variant_all, { shouldDirty: true });
    setValue("price_total_order_actual", price_total_order_actual, { shouldDirty: true });

    setValue("price_after_paid", price_total_order_actual, { shouldDirty: true });

    resetPayment();

    setValue<keyof OrderDTOV2>("line_items", variants, { shouldValidate: true, shouldDirty: true });
  };

  // show modal confirm variant
  const handleConfirmForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // với đơn sao chép hoặc đơn tạo
    if (!row?.id) {
      handleSubmit(() => setIsConfirmModal((prev) => !prev))(e);
    } else {
      handleSubmitForm(e);
    }
  };

  const handleSubmitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsConfirmModal(false);
    await handleSubmit(handleSubmitOrder)(e);
  };

  const handleSubmitOrder = async (form: Partial<OrderDTOV2>) => {
    const payload = handleFormatFormToPayload({ form });
    if (payload) {
      row?.id ? await handleUpdateOrder(payload) : await handleCreateOrder(payload);
    }
  };

  const handleClose = () => {
    clearErrors();
    onClose?.();
    CACHE_ORDER = undefined;
    reset({});
  };

  useEffect(() => {
    handleNotifyErrors(errors);
  }, [errors]);

  useEffect(() => {
    if (row?.id) {
      getOrderByID();
    } else {
      CACHE_ORDER = ORDER_DEFAULT;
      reset(ORDER_DEFAULT);
    }
  }, [getOrderByID, reset, row?.id]);

  //đơn đang nháp hoặc đã xác nhận nhưng chưa giao hàng thì vẫn cho huỷ
  const isShowCancelButton = CACHE_ORDER?.status === "draft" || CACHE_ORDER?.status === "completed";

  const headerPageTitle = order_key
    ? `${ORDER_LABEL.order_detail} - ${order_key}`
    : `${ORDER_LABEL.create_order}`;

  const isCancelStatus = CACHE_ORDER?.status === "cancel";

  const disabledSubmit = isCancelStatus;

  const { isDenyConfirm, totalQuantity } = useMemo(
    () =>
      handleCheckInventory({
        lineItems: line_items,
        listInventory,
        listInventoryInOrder,
        warehouseIds,
      }),
    [line_items, listInventory, listInventoryInOrder, warehouseIds],
  );

  const labelSubmitButton = row?.id ? BUTTON.UPDATE : BUTTON.ADD;

  const cancelDisabled = // disabled button huỷ đơn khi
    loading || // loading dữ liệu hoặc
    CACHE_ORDER?.status === "cancel" || // đơn đang là đơn HUỶ hoặc
    CACHE_ORDER?.status === "completed"; // bên giao hàng đã qua lấy hàng

  return (
    <>
      <ConfirmVariantModal
        totalQuantity={totalQuantity}
        open={isConfirmModal}
        setOpen={setIsConfirmModal}
        onSubmit={handleSubmitForm}
        loading={loading}
        isDenyConfirm={isDenyConfirm}
        listInventory={listInventory}
        listInventoryInOrder={listInventoryInOrder}
      />

      <HeaderPanel title={headerPageTitle} onClose={onClose ? handleClose : undefined} />
      <Divider />
      <DialogContent sx={{ p: onClose ? [1, 1, 2, 4] : 1, ...styled.dialogContent }}>
        {!!row?.id && (
          <HeaderAction
            {...getValues()}
            isShowCancelButton={isShowCancelButton}
            onCancelOrder={handleSubmitCancelOrder}
            rowId={row?.id}
            cancelDisabled={cancelDisabled}
          />
        )}
        {loading && <LinearProgress sx={{ mb: 0.5 }} />}
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9}>
            <LineItem
              rowId={row?.id}
              error={errors.line_items as any}
              line_items={line_items}
              setListVariants={handleChangeVariants}
              onChangeVariantInventory={setValue}
              listInventory={listInventory}
              setListInventory={setListInventory}
              listInventoryInOrder={listInventoryInOrder}
              setListInventoryInOrder={setListInventoryInOrder}
            />
            <OrderPrice
              {...getValues()}
              orderId={row?.id}
              onChange={(key, value) =>
                setValue(key, value, { shouldValidate: true, shouldDirty: true })
              }
              errors={errors}
              rowId={row?.id}
              status={status}
              payments={payments}
            />
            {row?.id && <HistoryTimeline order={getValues()} onRefresh={onClose || getOrderByID} />}
          </Grid>
          <Grid item xs={12} lg={3}>
            <Stack spacing={2}>
              <General
                {...getValues()}
                isAvailableInventory={!isDenyConfirm}
                onChange={(key, value) =>
                  setValue<keyof OrderDTOV2>(key, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                errors={errors}
                defaultTagOptions={orderContext?.tags}
                defaultStatus={CACHE_ORDER?.status}
                orderID={row?.id}
                isConfirm={CACHE_ORDER?.status === "completed" || !!complete_time}
              />
              <Customer
                onChangeShippingAddress={(value) =>
                  setValue<keyof OrderDTOV2>("address_shipping", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onChange={(key, value) =>
                  setValue<keyof OrderDTOV2>(key as any, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                id={customer?.id}
                addressShipping={address_shipping}
                errors={errors}
                isConfirm={status === "completed" || !!complete_time}
                phoneShipping={phone_shipping}
                nameShipping={name_shipping}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <BottomPanel
        buttonLabel={labelSubmitButton}
        onSubmit={handleConfirmForm}
        disabled={disabledSubmit}
        loading={loading}
        onClose={onClose}
      />
    </>
  );
};

export default memo(OrderForm);

const styled: TSx<"dialogContent"> = {
  dialogContent: { pt: [1, 1, 2, 4], pb: [1, 1, 2, 4] },
};
