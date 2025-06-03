import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { LabelInfo, TextInfo } from "components/Texts";
import { ORDER_LABEL } from "constants/order/label";
import { FieldError } from "react-hook-form";

const Note = ({
  error,
  isEdit,
  onChange,
  value,
}: {
  isEdit?: boolean;
  error?: FieldError;
  onChange: (value: string) => void;
  value?: string;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>{ORDER_LABEL.payment_note}</LabelInfo>
      </Grid>
      <Grid item xs={6}>
        {isEdit ? (
          <TextField
            fullWidth
            error={!!error}
            helperText={error?.message}
            multiline
            minRows={2}
            placeholder={ORDER_LABEL.payment_note}
            label={ORDER_LABEL.payment_note}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <TextInfo sx={{ fontWeight: 700, textAlign: "end" }}>{value}</TextInfo>
        )}
      </Grid>
    </Grid>
  );
};

export default Note;
