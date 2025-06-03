import styled from "@mui/material/styles/styled";

export const GroupItemColumns = ({ value }: { value: string }) => {
  return <SummaryLabel>{value}</SummaryLabel>;
};

const SummaryLabel = styled("p")(() => ({
  fontSize: "0.82rem",
  fontWeight: "bold",
  margin: 0,
}));
