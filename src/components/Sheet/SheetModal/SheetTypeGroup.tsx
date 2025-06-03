import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { ROLE_TAB, ROLE_WAREHOUSE } from "constants/role";
import { SHEET_LABEL } from "constants/warehouse/label";
import useAuth from "hooks/useAuth";
import { Control, Controller } from "react-hook-form";
import { TSheet } from "types/Sheet";
import { checkPermission } from "utils/roleUtils";

type Props = {
  control: Control<TSheet, object>;
};

const SheetTypeGroup = ({ control }: Props) => {
  const { user } = useAuth();
  const isRnWImportSheet = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.IMPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWExport = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.EXPORT_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWTransfer = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.TRANSFER_SHEET],
    user,
  ).isReadAndWrite;
  const isRnWCheck = checkPermission(
    user?.role?.data?.[ROLE_TAB.WAREHOUSE]?.[ROLE_WAREHOUSE.CHECK_SHEET],
    user,
  ).isReadAndWrite;
  return (
    <Controller
      name={"type"}
      control={control}
      render={({ field }) => {
        return (
          <FormControl>
            <FormLabel id="type-radio-buttons-group-label">{SHEET_LABEL.type}</FormLabel>
            <RadioGroup
              row
              aria-labelledby="type-radio-buttons-group-label"
              name="type-radio-buttons-group"
              value={field.value}
              onChange={(_e, value) => field.onChange(value)}
            >
              {isRnWImportSheet && (
                <FormControlLabel value="IP" control={<Radio />} label={SHEET_LABEL.import} />
              )}
              {isRnWExport && (
                <FormControlLabel value="EP" control={<Radio />} label={SHEET_LABEL.export} />
              )}
              {isRnWTransfer && (
                <FormControlLabel value="TF" control={<Radio />} label={SHEET_LABEL.transfer} />
              )}
              {isRnWCheck && (
                <FormControlLabel value="CK" control={<Radio />} label={SHEET_LABEL.checked} />
              )}
            </RadioGroup>
          </FormControl>
        );
      }}
    />
  );
};
export default SheetTypeGroup;
