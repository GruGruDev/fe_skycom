import FormControlLabel, { FormControlLabelProps } from "@mui/material/FormControlLabel";
import Radio, { RadioProps } from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TBatchSheet } from "types/Sheet";
import { Span } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";

interface Props extends Partial<TBatchSheet> {
  radioProps?: Partial<RadioProps>;
  formLabelProps?: Partial<FormControlLabelProps>;
}

const InventoryItem = (props: Props) => {
  const { batch_name, total_inventory = 0, inventories = [] } = props;

  const warehouse_name = inventories[0]?.warehouse_name;

  return (
    <FormControlLabel
      {...props.formLabelProps}
      value={props.batch_id}
      control={<Radio {...props.radioProps} />}
      label={
        <Stack direction="row" alignItems="center">
          <Typography component="li" fontSize={"0.82rem"}>
            {`${ORDER_LABEL.warehouse}: `}
            <Span>{` ${warehouse_name}`}</Span>
            {` - ${ORDER_LABEL.batch}: `}
            <Span>{` ${batch_name}`}</Span>
            {` - ${ORDER_LABEL.inventory}: `}
            <Span color="secondary">{` ${total_inventory}`}</Span>
          </Typography>
        </Stack>
      }
    />
  );
};

export default InventoryItem;
