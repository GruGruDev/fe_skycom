import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { LABEL } from "constants/label";
import { TAttribute } from "types/Attribute";

interface Props {
  row: TAttribute;
  handleActiveSwitch?: (att: TAttribute) => Promise<void>;
  expanded?: boolean;
  type: string;
}

const AttributeItem = ({ row, handleActiveSwitch, type }: Props) => {
  return (
    <>
      <Stack direction="row" alignItems="center" p={1} pl={3}>
        <Typography style={labelStyle}>{row.name}</Typography>
        <div
          style={
            handleActiveSwitch ? { display: "flex", justifyContent: "right" } : iconColumnStyle
          }
        >
          <Stack direction="row" alignItems={"center"}>
            {handleActiveSwitch && (
              <Tooltip title={LABEL.ACTIVE}>
                <Switch
                  checked={row.is_shown}
                  onChange={(event) =>
                    handleActiveSwitch({
                      type,
                      is_shown: event.target.checked,
                      id: row.id,
                    })
                  }
                  size="small"
                />
              </Tooltip>
            )}
          </Stack>
        </div>
      </Stack>
    </>
  );
};

export default AttributeItem;

const labelStyle = { display: "flex", flex: 1, fontSize: "0.82rem" };
const iconColumnStyle = { width: 120 };
