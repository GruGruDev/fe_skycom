import { useState } from "react";
import { TParams } from "types/Param";
import MContainer from "../components/MContainer";

const MAll = () => {
  const [params, setParams] = useState<TParams>({ limit: 15, page: 1, ordering: "-created" });

  return <MContainer params={params} setParams={setParams} isFilterStatus />;
};

export default MAll;
