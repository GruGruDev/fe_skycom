import { GridWrapHeaderProps, HeaderWrapper } from "components/Table/Header";
import Box from "@mui/material/Box";

export interface PivotHeaderProps extends GridWrapHeaderProps {
  date_from?: string;
  date_to?: string;
  dateValue?: string | number;
  onChangeDate?: (date: {
    date_from?: string;
    date_to?: string;
    dateValue: string | number;
  }) => void;
}

const PivotHeader = (props: PivotHeaderProps) => {
  // const { date_from, date_to, dateValue, onChangeDate } = props;
  return (
    <Box>
      <HeaderWrapper {...props} containerStyles={{ padding: 0 }} />
    </Box>
  );
};

export default PivotHeader;
