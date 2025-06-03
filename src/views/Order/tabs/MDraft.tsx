import { useState } from "react";
import { TOrderStatus } from "types/Order";
import { TParams } from "types/Param";
import MContainer from "../components/MContainer";

const MDraft = () => {
  const [params, setParams] = useState<TParams>({ limit: 15, page: 1, ordering: "-created" });

  return <MContainer params={{ ...params, status: [TOrderStatus.DRAFT] }} setParams={setParams} />;
};

export default MDraft;
