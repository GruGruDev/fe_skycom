import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import SliderField from "components/Fields/SliderField";
import { CUSTOMER_LABEL } from "constants/customer/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { createRank, removeRank, updateRank } from "store/redux/customers/action";
import { TAttribute } from "types/Attribute";
import { TRank } from "types/Customer";
import { TParams } from "types/Param";
import { TStyles } from "types/Styles";
import { fNumber, fShortenNumber } from "utils/number";
import { checkPermission } from "utils/roleUtils";

const TEN_BIL = 10000000000;

const Rank = () => {
  const [state, setState] = useState({ loading: false, error: false, type: null });
  const { user } = useAuth();

  const { ranks } = useAppSelector(getDraftSafeSelector("customer")).attributes;

  const handleCreateRank = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await createRank(payload as TParams);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleUpdateRank = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await updateRank(payload as TParams);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const handleRemoveRank = async (payload: TAttribute) => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = await removeRank(payload);

    if (result) {
      setState((prev) => ({ ...prev, loading: false }));
      return true;
    } else {
      setState((prev) => ({ ...prev, loading: false, error: true }));
      return false;
    }
  };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.CUSTOMER],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => {
        const { name_rank, spend_from, spend_to } = row as TRank;
        return (
          <Box px={1}>
            <Typography fontSize={"0.9rem"}>{name_rank}</Typography>
            <Typography fontSize={"0.82rem"} color={"grey"}>{`${
              CUSTOMER_LABEL.spent_from
            }: ${fNumber(spend_from)} -> ${fNumber(spend_to)}`}</Typography>
          </Box>
        );
      }}
      funcContentRender={(methods: UseFormReturn<any, object>) => {
        const {
          setValue,
          watch,
          formState: { errors },
        } = methods as UseFormReturn<TRank, object>;
        const { spend_from = 0, spend_to = 0, name_rank = "" } = watch();
        return (
          <Box>
            <TextField
              fullWidth
              value={name_rank}
              onChange={(e) => setValue("name_rank", e.target.value, { shouldDirty: true })}
              label={CUSTOMER_LABEL.rank}
              InputLabelProps={{ shrink: true }}
              error={!!errors.name_rank?.message}
              helperText={errors.name_rank?.message}
            />
            <SliderField
              onSubmit={([from, to]) => {
                setValue("spend_from", from, { shouldDirty: true });
                setValue("spend_to", to, { shouldDirty: true });
              }}
              slides={[spend_from, spend_to]}
              rangeSliceArr={[
                { label: "0", value: 0 },
                { label: fShortenNumber(TEN_BIL).toString(), value: TEN_BIL },
              ]}
              title={CUSTOMER_LABEL.total_spent}
              style={styles.slider}
              inputFormatFunc={fNumber}
              sliderFormatFunc={fShortenNumber}
            />
          </Box>
        );
      }}
      state={state}
      formDefaultData={(row) => row}
      formSchema={(yup) => ({
        name_rank: yup.string().required(VALIDATION_MESSAGE.REQUIRE_ATTRIBUTE),
      })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateRank : undefined}
      handleDeleteAction={isReadAndWriteAttribute ? handleRemoveRank : undefined}
      handleEditAction={isReadAndWriteAttribute ? handleUpdateRank : undefined}
      data={ranks}
      title={CUSTOMER_LABEL.rank}
      type={"ranks"}
    />
  );
};

export default Rank;

const styles: TStyles<"slider"> = {
  slider: { padding: 16, paddingTop: 32 },
};
