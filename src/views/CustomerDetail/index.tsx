import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { customerApi } from "apis/customer";
import { orderApi } from "apis/order";
import { PageWithTitle } from "components/Page";
import HeaderPage from "components/Page/HeaderPage";
import { TabPanelWrap, TabType } from "components/Tabs";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { ALL } from "constants/index";
import { PAGE_TITLE } from "constants/pageTitle";
import { ROLE_ORDER, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import filter from "lodash/filter";
import flatten from "lodash/flatten";
import map from "lodash/map";
import { memo, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PATH_DASHBOARD } from "routers/paths";
import { TCustomer, THistoryCustomer } from "types/Customer";
import { HISTORY_ACTIONS } from "types/History";
import { TOrderV2 } from "types/Order";
import { ROOT_PATH } from "types/Router";
import { TStyles, TSx } from "types/Styles";
import { TUser } from "types/User";
import { onChangeHistoryFields } from "utils/customer/onChangeHistoryFields";
import { handleCompareHistoryItem } from "utils/handleCompareHistoryItem";
import { isMatchRoles } from "utils/roleUtils";
import DetailTimeline from "./components/DetailTimeline";
import Overview from "./components/Overview";
import Order from "./tabs/Order";

type ORDER_TIMELINE_TYPE = "CUSTOMER_HISTORY" | "ORDER" | "CDP";

const flattenHistoryByCategory = ({
  results,
  setTagCategoryFilter,
  setHistoryData,
  category,
  label,
}: {
  results: any[];
  setTagCategoryFilter: (value: React.SetStateAction<{ [key: string]: string }>) => void;
  setHistoryData: (value: any) => void;
  category: ORDER_TIMELINE_TYPE;
  label: string;
}) => {
  if (results.length > 0) {
    setTagCategoryFilter((prev) => ({
      ...prev,
      [category]: label,
    }));
  }
  const result = map(results, (item) => ({ category, label, ...item }));
  setHistoryData((prev: any) =>
    [...flatten(result), ...prev].sort((a, b) => (a.history_date >= b.history_date ? -1 : 1)),
  );
  return result;
};

export interface CDPProps {
  params?: { date_from: string; date_to: string; toValue?: any };
  isMutationNote?: boolean;
  isEdit?: boolean;
  onRefreshCDPRow?: (customer: Partial<TCustomer>) => void;
  isSearchCustomer?: boolean;
  isShowTimeline?: boolean;
  isShowTableDetail?: boolean;
}

let FETCH_TIMELINE_BY_CATEGORY: ORDER_TIMELINE_TYPE[] = [];

export const CUSTOMER_DETAIL_TAB = (user: Partial<TUser> | null): TabType[] => [
  {
    component: <Order />,
    title: "Order",
    label: CUSTOMER_LABEL.orders_tab_label,
    role: isMatchRoles(
      user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.HANDLE],
      user?.is_superuser,
    ),
  },
];

const Detail = (props: CDPProps) => {
  const { isEdit, isSearchCustomer, onRefreshCDPRow } = props;

  const { id } = useParams();
  const { user } = useAuth();

  const [countLoading, setCountLoading] = useState(0);
  const [historyData, setHistoryData] = useState<any>([]);
  const [tagCategoryFilter, setTagCategoryFilter] = useState<{ [key: string]: string }>({
    "": ALL,
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { users } = useAppSelector(getDraftSafeSelector("users"));

  const getOrderData = useCallback(async () => {
    const isMatchOrderRole = isMatchRoles(
      user?.role?.data?.[ROLE_TAB.ORDERS]?.[ROLE_ORDER.HANDLE],
      user?.is_superuser,
    );

    if (isMatchOrderRole) {
      if (!FETCH_TIMELINE_BY_CATEGORY.includes("ORDER") && id) {
        FETCH_TIMELINE_BY_CATEGORY.push("ORDER");
        const res = await orderApi.get<TOrderV2>({
          params: { customer: id, limit: 500, page: 1 },
        });
        setCountLoading((prev) => prev + 1);

        if (res.data) {
          const { results } = res.data;
          return flattenHistoryByCategory({
            category: "ORDER",
            label: CUSTOMER_LABEL.order,
            results,
            setHistoryData,
            setTagCategoryFilter,
          });
        }
        return [];
      } else {
        return [];
      }
    }
  }, [id, user?.is_superuser, user?.role?.data]);

  const getCustomerHistoryData = useCallback(async () => {
    if (!FETCH_TIMELINE_BY_CATEGORY.includes("CUSTOMER_HISTORY") && id) {
      FETCH_TIMELINE_BY_CATEGORY.push("CUSTOMER_HISTORY");
      setCountLoading((prev) => prev + 1);

      const res = await customerApi.get<THistoryCustomer>({
        params: { customer_id: id, limit: 500, page: 1 },
        endpoint: "history/",
      });

      if (res.data) {
        const { results } = res.data;

        let historyChanges: any[] = [];

        results.map((item, itemIdx) => {
          if (
            item.history_type !== HISTORY_ACTIONS.ADD &&
            item.history_type !== HISTORY_ACTIONS.CREATE
          ) {
            const changeFields = handleCompareHistoryItem({
              curItem: item,
              prevItem: results[itemIdx + 1],
            }).changeFields;

            if (changeFields.length) {
              const histories = onChangeHistoryFields({
                fieldChanges: changeFields,
                old: results[itemIdx + 1],
                cur: item,
                users,
              });

              if (histories.length) {
                historyChanges = [
                  ...historyChanges,
                  {
                    histories: histories,
                    history_date: item.history_date,
                    category: "CDP",
                    label: CUSTOMER_LABEL.customer,
                  },
                ];
              }
            }
          } else {
            historyChanges = [
              ...historyChanges,
              { ...item, category: "CDP", label: CUSTOMER_LABEL.customer },
            ];
          }
        });
        return flattenHistoryByCategory({
          setHistoryData,
          setTagCategoryFilter,
          category: "CDP",
          results: historyChanges,
          label: CUSTOMER_LABEL.customer,
        });
      }
      return [];
    } else {
      return [];
    }
  }, [id, users]);

  useEffect(() => {
    getOrderData();
  }, [getOrderData]);

  useEffect(() => {
    getCustomerHistoryData();
  }, [getCustomerHistoryData]);

  return (
    <PageWithTitle title={`${PAGE_TITLE.customer.list[ROOT_PATH]}`}>
      <Box style={styles.wrapper} sx={{ p: [0, 1, 2] }}>
        <HeaderPage link={`/${PATH_DASHBOARD.customer.list[""]}`} />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={6} height="fit-content">
            <Overview
              isEdit={isEdit}
              onRefreshCDPRow={onRefreshCDPRow}
              isSearchCustomer={isSearchCustomer}
              customerId={id}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={styled.historyTimelineContainer}
            style={styles.timelineWrapper}
          >
            <DetailTimeline
              data={filter(
                historyData,
                (item) => item?.category === categoryFilter || !categoryFilter,
              )}
              loading={countLoading !== FETCH_TIMELINE_BY_CATEGORY.length}
              tagCategoryFilter={tagCategoryFilter}
              onFilterCategory={setCategoryFilter}
              categoryFilter={categoryFilter}
            />
          </Grid>
        </Grid>
        <Stack mt={2}>
          <TabPanelWrap tabs={CUSTOMER_DETAIL_TAB(user)} tabPanelSx={styled.tabPannel} />
        </Stack>
      </Box>
    </PageWithTitle>
  );
};

export default memo(Detail);

const styles: TStyles<"timelineWrapper" | "wrapper"> = {
  wrapper: { width: "100%", position: "relative", overflow: "auto" },
  timelineWrapper: { paddingTop: 24, paddingBottom: 8, paddingRight: 8 },
};

const styled: TSx<"tabPannel" | "historyTimelineContainer"> = {
  historyTimelineContainer: {
    overflow: "hidden",
    contain: { sm: "initial", md: "size" },
    maxHeight: { sm: "400px", md: "100%" },
  },
  tabPannel: {
    padding: "8px 16px",
    boxShadow:
      "0px 3px 3px -2px rgba(145, 158, 171, 0.2), 0px 3px 4px 0px rgba(145, 158, 171, 0.14), 0px 1px 8px 0px rgba(145, 158, 171, 0.12)",
    borderRadius: "8px",
    width: "100%",
  },
};
