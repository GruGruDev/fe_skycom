import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { FieldError } from "react-hook-form";
import { OrderDTOV2 } from "types/Order";

const DeliveryNote = ({
  rowId,
  delivery_note,
  error,
  onChange,
}: {
  rowId?: string;
  delivery_note?: string;
  error?: FieldError;
  onChange: (key: keyof OrderDTOV2, value: string) => void;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1} mb={1}>
      <Grid item xs={6}>
        <LabelInfo>{ORDER_LABEL.delivery_note}</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {rowId ? (
          <TextInfo sx={{ fontWeight: 700, width: "100%", textAlign: "end" }}>
            {delivery_note || "---"}
          </TextInfo>
        ) : (
          <TextField
            fullWidth
            multiline
            error={!!error}
            helperText={error?.message}
            minRows={2}
            value={delivery_note}
            onChange={(e) => onChange("delivery_note", e.target.value)}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default DeliveryNote;
