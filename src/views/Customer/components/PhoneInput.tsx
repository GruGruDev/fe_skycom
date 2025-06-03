import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { customerApi } from "apis/customer";
import { CUSTOMER_LABEL } from "constants/customer/label";
import findIndex from "lodash/findIndex";
import { useState } from "react";
import { TPhone } from "types/Customer";
import { TStyles } from "types/Styles";
import { maskedPhone } from "utils/strings";

const PhoneInput = (props: {
  phones?: Partial<TPhone>[];
  errorMessage?: string;
  isDelete?: boolean;
  customerId?: string;
  onChange: (phones: Partial<TPhone>[]) => void;
  setIsRefreshTable?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { onChange, errorMessage, isDelete, phones = [], customerId, setIsRefreshTable } = props;

  const [phoneInput, setPhoneInput] = useState<string>();

  const handleDeletePhone = async (index: number, phoneId?: string) => {
    const cloneClones = [...phones];
    if (!phoneId) {
      cloneClones.splice(index, 1);
      onChange(cloneClones);
      return;
    }
    const phoneIdx = findIndex(phones, (item) => item.id === phoneId);
    cloneClones.splice(phoneIdx, 1);
    const phone = phones[phoneIdx];

    if (customerId) {
      const res = await customerApi.removeById<{ phone: string; customer: string }>({
        params: { phone: phone?.phone, customer: customerId },
        endpoint: `phones/${phone?.id}/`,
      });

      if (res.data) {
        onChange(cloneClones);
        setIsRefreshTable?.(true);
      }
    } else {
      onChange(cloneClones);
      if (cloneClones.length === 0) {
        setPhoneInput("");
      }
    }
  };

  const handleAddPhone = async (value: string) => {
    if (customerId) {
      const res = await customerApi.create<{ phone: string; customer: string }>({
        params: { phone: value, customer: customerId },
        endpoint: "phones/",
      });

      if (res.data) {
        onChange([...phones, res.data]);
        setPhoneInput(undefined);
        setIsRefreshTable?.(true);
      }
    } else {
      onChange([...phones, { phone: value }]);
      setPhoneInput(undefined);
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Stack spacing={2}>
          <FormLabel style={styles.formLabel}>{CUSTOMER_LABEL.phones}</FormLabel>
          <Box component="ul" width="100%" style={styles.listPhoneWrapper}>
            {phones.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                ml={2}
              >
                <Typography component="li" fontSize="14px">
                  {maskedPhone(item.phone || "")}
                </Typography>
                {phones.length > 1 && (
                  <IconButton
                    style={styles.removeIcon}
                    onClick={() => handleDeletePhone(index, item?.id)}
                  >
                    <Tooltip title={CUSTOMER_LABEL.delete_phone}>
                      <DeleteIcon style={styles.deleteIcon} />
                    </Tooltip>
                  </IconButton>
                )}
              </Stack>
            ))}
          </Box>

          {phoneInput === undefined ? (
            <Button
              style={styles.addPhoneButton}
              onClick={() => setPhoneInput("")}
              startIcon={<AddCircleOutlineIcon />}
            >
              {CUSTOMER_LABEL.add_phone}
            </Button>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                fullWidth
                label={CUSTOMER_LABEL.phone_number}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                error={!phoneInput}
                helperText={!phoneInput ? errorMessage : ""}
                disabled={isDelete}
                autoFocus
              />
              {!!phoneInput ? (
                <IconButton onClick={() => handleAddPhone(phoneInput || "")}>
                  <Tooltip title={CUSTOMER_LABEL.add_phone}>
                    <AddCircleOutlineIcon color="primary" />
                  </Tooltip>
                </IconButton>
              ) : (
                <IconButton onClick={() => setPhoneInput(undefined)}>
                  <Tooltip title="Cancel">
                    <CancelIcon />
                  </Tooltip>
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>
      </FormControl>
    </Grid>
  );
};

export default PhoneInput;

const styles: TStyles<
  "removeIcon" | "deleteIcon" | "wrapper" | "addPhoneButton" | "formLabel" | "listPhoneWrapper"
> = {
  wrapper: { paddingRight: 20, display: "flex", alignItems: "flex-start" },
  removeIcon: { fontSize: "0.82rem", cursor: "pointer" },
  deleteIcon: { fontSize: "1rem" },
  addPhoneButton: { width: "fit-content" },
  formLabel: { fontSize: "0.82rem" },
  listPhoneWrapper: { marginTop: 8 },
};
