import BallotIcon from "@mui/icons-material/Ballot";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { orderApi } from "apis/order";
import { TabRouteWrap } from "components/Tabs";
import { PAGE_TITLE } from "constants/pageTitle";
import { createContext, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { PATH_DASHBOARD } from "routers/paths";
import { TAttribute } from "types/Attribute";
import { CancelContext, useCancelContext } from "./contexts/CancelContext";
import { CompletedContext, useCompletedContext } from "./contexts/CompletedContext";
import { DraftContext, useDraftContext } from "./contexts/DraftContext";
import { AllContext, useAllContext } from "./contexts/TabAllContext";
import { ROOT_PATH } from "types/Router";

export const ORDER_TABS = [
  {
    label: PAGE_TITLE.orders.list.all,
    path: `/${PATH_DASHBOARD.orders.list.all}`,
    icon: <BallotIcon />,
  },
  {
    label: PAGE_TITLE.orders.list.draft,
    path: `/${PATH_DASHBOARD.orders.list.draft}`,
    icon: <WatchLaterIcon />,
  },
  {
    label: PAGE_TITLE.orders.list.completed,
    path: `/${PATH_DASHBOARD.orders.list.completed}`,
    icon: <CheckCircleIcon />,
  },
  {
    label: PAGE_TITLE.orders.list.cancel,
    path: `/${PATH_DASHBOARD.orders.list.cancel}`,
    icon: <CancelIcon />,
  },
];

const OrderPage = () => {
  return <TabRouteWrap routes={ORDER_TABS} title={`${PAGE_TITLE.orders.list[ROOT_PATH]}`} />;
};

export type OrderContextType =
  | (Partial<AllContext & DraftContext & CompletedContext & CancelContext> & {
      tags: TAttribute[];
      getTags: () => Promise<void>;
      cancelReasons: TAttribute[];
      getCancelReasons: () => Promise<void>;
    })
  | null;

export const OrderContext = createContext<OrderContextType>(null);

const OrderView = () => {
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [cancelReasons, setCancelReasons] = useState<{ id: string; name: string }[]>([]);

  const getTags = useCallback(async () => {
    const result = await orderApi.get<{ id: string; name: string }>({
      endpoint: "tags/",
      params: { limit: 200, page: 1, is_shown: "true" },
    });
    if (result?.data) {
      setTags(result.data.results);
    }
  }, []);

  const getCancelReasons = useCallback(async () => {
    const result = await orderApi.get<{ id: string; name: string }>({
      endpoint: "cancel-reason/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setCancelReasons(result.data.results);
    }
  }, []);

  useEffect(() => {
    Promise.all([getTags(), getCancelReasons()]);
  }, [getTags, getCancelReasons]);

  useLayoutEffect(() => {}, []);

  return (
    <OrderContext.Provider
      value={{
        ...useAllContext(),
        ...useDraftContext(),
        ...useCompletedContext(),
        ...useCancelContext(),
        tags,
        getTags,
        cancelReasons,
        getCancelReasons,
      }}
    >
      <OrderPage />
    </OrderContext.Provider>
  );
};

export default OrderView;
