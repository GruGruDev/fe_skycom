import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { TParams } from "types/Param";

const useRouteParams = () => {
  const location = useLocation();

  const routerParams = useMemo(() => {
    const query = new URLSearchParams(location.search);
    let params: TParams = {};
    for (const [key, value] of query.entries()) {
      params[key] = value;
    }
    return params;
  }, [location.search]);

  return routerParams;
};

export default useRouteParams;
