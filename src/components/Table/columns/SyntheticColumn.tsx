import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Span } from "components/Texts";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { LABEL } from "constants/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import find from "lodash/find";
import get from "lodash/get";
import { TColumn } from "types/DGrid";
import { fDate, fDateTime } from "utils/date";
import { fNumber, formatFloatToString } from "utils/number";
import { maskedPhone } from "utils/strings";
import HandlerImage from "components/Images/HandlerImage";

const COLUMN_NAMES = [""];

const TRUETHY = [true, "ACTIVE"];
interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
}

export const SynctheticColumn = ({ for: columnNames = [], ...props }: Props) => {
  const Formatter = ({ value, column, row }: { value: any; column: TColumn; row?: any }) => {
    const { users } = useAppSelector(getDraftSafeSelector("users"));

    if (column.options?.get) {
      value = get(value, column.options?.get);
    }

    switch (column.type) {
      case "date":
        return <Typography>{fDate(value)}</Typography>;

      case "datetime":
        return <Typography>{fDateTime(value)}</Typography>;

      case "number":
        return (
          <Typography width={"100%"} textAlign={"center"}>
            {fNumber(value)}
          </Typography>
        );

      case "float":
        return (
          <Typography width={"100%"} textAlign={"center"}>
            {Number.isInteger(value) ? fNumber(value) : formatFloatToString(value)}
          </Typography>
        );

      case "percent":
        return (
          <Typography>{`${
            Number.isInteger(value) ? `${value}` : parseFloat(value).toFixed(2)
          }%`}</Typography>
        );
      case "phone":
        return <Typography>{maskedPhone(value)}</Typography>;

      case "gender":
        const male = value === "male";
        const isShow = value === "female" || value === "male";
        const female = value === "female";
        return isShow ? (
          <Span color={male ? "info" : "warning"}>
            {male && CUSTOMER_LABEL.male}
            {female && CUSTOMER_LABEL.female}
          </Span>
        ) : null;

      case "attribute":
        return <Typography>{value?.name}</Typography>;

      case "boolean":
        return column.options?.span ? (
          <Box display="flex" justifyContent="center">
            {TRUETHY.includes(value) ? (
              <Span color={column.options?.reverse ? "error" : "success"}>{column.title}</Span>
            ) : (
              <Span color="info">{LABEL.NO}</Span>
            )}
          </Box>
        ) : (
          <Box width={80} display="flex" justifyContent="center">
            {TRUETHY.includes(value) ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </Box>
        );

      case "user":
        if (typeof value === "object") {
          return <Typography>{value?.name}</Typography>;
        }

        const user = find(users, (item) => item.id === value);
        return <Typography>{user?.name}</Typography>;

      case "customer":
        if (typeof value === "string") {
          // dành cho bảng customer
          return <Link href={`/customer/${row?.id}`}>{value}</Link>;
        }

        return <Link href={`/customer/${value?.id}`}>{value?.name}</Link>;

      case "image":
        const width = column.options?.width || 42;
        const onlyOne = column.options?.onlyOne == undefined ? true : column.options?.onlyOne;

        return <HandlerImage width={width} onlyOne={onlyOne} value={value} />;

      default:
        return <Typography>{value}</Typography>;
    }
  };
  return (
    <DataTypeProvider
      formatterComponent={Formatter}
      {...props}
      for={[...COLUMN_NAMES, ...columnNames]}
    />
  );
};
