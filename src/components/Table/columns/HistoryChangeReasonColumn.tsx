import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { TAttribute } from "types/Attribute";
import { THistoryChangeReasonRes } from "types/History";
import { TRole } from "types/Permission";
import { TUser } from "types/User";
import { handleCompareHistoryItem } from "utils/handleCompareHistoryItem";

interface Props {
  for?: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;
  getOldHistoryItem?: (idx: number) => any;
  historyFieldChangeString: (row: {
    fieldChanges: string[];
    old: any;
    cur: any;
    users?: TUser[];
    roles?: TRole[];
    productCategory?: TAttribute[];
    channel?: TAttribute[];
    list?: TAttribute[];
    fail_reason?: TAttribute[];
    after_bad_data_reason?: TAttribute[];
  }) => THistoryChangeReasonRes[];
  roles?: TRole[];
  productCategory?: TAttribute[];
  channel?: TAttribute[];
  list?: TAttribute[];
  fail_reason?: TAttribute[];
  after_bad_data_reason?: TAttribute[];
}

const COLUMN_NAMES = ["history_change_reason"];

export const HistoryChangeReasonColumn = ({
  for: columnNames = [],
  getOldHistoryItem,
  historyFieldChangeString,
  roles,
  productCategory,
  channel,
  list,
  fail_reason,
  after_bad_data_reason,
  ...props
}: Props) => {
  const Formatter = ({ row = {} }: { row?: Partial<any> }) => {
    const { users } = useAppSelector(getDraftSafeSelector("users"));
    const { historyIdx } = row;

    // Trong mảng histories, lịch sử cập nhật mới nhất sẽ ở vị trí 0
    if (getOldHistoryItem) {
      const old = getOldHistoryItem(historyIdx + 1);

      const changeFields = handleCompareHistoryItem({
        curItem: row,
        prevItem: getOldHistoryItem(historyIdx + 1),
      }).changeFields;

      if (changeFields?.length) {
        const history = historyFieldChangeString({
          fieldChanges: changeFields,
          old,
          cur: row,
          users,
          roles,
          productCategory,
          channel,
          list,
          fail_reason,
          after_bad_data_reason,
        });

        return (
          <Stack spacing={0.5}>
            {history.map((item, index) =>
              item.old !== item.cur
                ? (old || (!old && !!item.cur)) && (
                    <Stack key={index}>
                      <Stack direction="row" spacing={1} alignItems={"center"}>
                        <Typography component="span" fontSize="0.82rem">
                          {`${item.field}: `}
                        </Typography>
                        {old && (
                          <>
                            <Chip size="small" label={item.old} color="default" />
                            <Typography component="span" fontSize="0.82rem">
                              {`-`}
                            </Typography>
                          </>
                        )}

                        <Chip size="small" label={item.cur} color="primary" />
                      </Stack>
                    </Stack>
                  )
                : null,
            )}
          </Stack>
        );
      }
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
