import { useCallback, useEffect, useState } from "react";
import { TParams } from "types/Param";

function useScrollToBottom({
  onLoadMore,
  params = {},
  dataState = {},
}: {
  onLoadMore?: (newParams: TParams) => void;
  params?: TParams;
  dataState?: { loading?: boolean; count?: number };
}) {
  const [state, setState] = useState({ isShowFullData: false, isBottom: true });
  const handleLoadMore = useCallback(async () => {
    const { limit = 0, page = 0 } = params;
    const { loading, count = 0 } = dataState;
    if (loading) {
      return;
    }

    try {
      const isShowFullData = (count as number) <= (limit as number) * (page as number);

      if (isShowFullData) {
        setState((prev) => ({ ...prev, isShowFullData: true }));
        return;
      }

      const increasePage = (page as number) + 1;
      onLoadMore?.({ ...params, page: increasePage });
    } catch (error) {
      console.error(error);
    } finally {
    }
  }, [params, onLoadMore, dataState]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      const isBottom = scrollTop / Math.abs(scrollHeight - scrollTop - clientHeight) > 5;

      if (isBottom) {
        handleLoadMore();
        setState((prev) => ({ ...prev, isBottom: true }));
      } else {
        setState((prev) => ({ ...prev, isBottom: false }));
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [handleLoadMore]);

  return state;
}

export default useScrollToBottom;
