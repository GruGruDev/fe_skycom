import { useState } from "react";
import { TParams } from "types/Param";
import MContainer from "../components/MContainer";
import { TOrderStatus } from "types/Order";

const MCompleted = () => {
  const [params, setParams] = useState<TParams>({ limit: 15, page: 1, ordering: "-created" });

  return (
    <MContainer params={{ ...params, status: [TOrderStatus.COMPLETED] }} setParams={setParams} />
  );
};

export default MCompleted;
