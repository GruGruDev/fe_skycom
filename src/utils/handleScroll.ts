import { TParams } from "types/Param";

export function handleScrollToBottom(
  callback?: (newParams: TParams) => void,
  params: TParams = {},
) {
  window.addEventListener("scroll", function () {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const { count = 0, limit = 10, page = 1, loading = false } = params;

    if (scrollTop + clientHeight >= scrollHeight) {
      const isShowFullData = (count as number) <= (limit as number) * (page as number);
      if (!loading && !isShowFullData) {
        const increasePage = (page as number) + 1;
        callback?.({ ...params, page: increasePage });
      }
    }
  });
}
