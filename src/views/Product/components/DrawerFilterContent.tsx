import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { PRODUCT_LABEL } from "constants/product/label";
import { TParams } from "types/Param";
import { TSelectOption } from "types/SelectOption";
import { BadgeLabel } from "components/Texts";
import compact from "lodash/compact";
import SliderFilter from "components/Table/Filter/SliderFilter";
import { fNumber } from "utils/number";

const TOTAL_INVENTORY_MAX = 100;
const STEP = 1;

type Props = {
  categoryOptions?: TSelectOption[];
  supplierOptions?: TSelectOption[];
  params: TParams;
  setParams: (params: TParams) => void;
};

const DrawerFilterContent = (props: Props) => {
  const { supplierOptions = [], categoryOptions = [], params, setParams } = props;
  const handleChangeCategoryParams = (index: number, value: string | number) => {
    let categoryParams = [...((params.category as string[]) || [])];
    if (categoryParams[index]) {
      delete categoryParams[index];
    } else {
      categoryParams[index] = value as string;
    }
    setParams({ ...params, category: categoryParams });
  };

  const handleChangeSupplierParams = (index: number, value: string | number) => {
    let categoryParams = [...((params.category as string[]) || [])];
    if (categoryParams[index]) {
      delete categoryParams[index];
    } else {
      categoryParams[index] = value as string;
    }
    setParams({ ...params, category: categoryParams });
  };

  return (
    <Stack spacing={2}>
      {categoryOptions.length ? (
        <Box bgcolor={(theme) => theme.palette.background.neutral} p={1} borderRadius={1}>
          <BadgeLabel number={compact(params.category as string[]).length}>
            <Typography fontSize={"1rem"}>{PRODUCT_LABEL.category}</Typography>
          </BadgeLabel>
          <Divider />
          <List sx={{ maxHeight: 300, overflowY: "auto" }}>
            {categoryOptions.map((c, index) => (
              <ListItem
                key={index}
                sx={{ p: 1 }}
                onClick={() => handleChangeCategoryParams(index, c.value)}
              >
                <Checkbox
                  sx={{ paddingY: 0, paddingX: 1 }}
                  checked={!!(params.category as string[])?.[index]}
                  onClick={() => handleChangeCategoryParams(index, c.value)}
                />
                <Typography fontSize={"0.8125rem"}>{c.label}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}
      {supplierOptions.length ? (
        <Box bgcolor={(theme) => theme.palette.background.neutral} p={1} borderRadius={1}>
          <BadgeLabel number={compact(params.supplier as string[]).length}>
            <Typography fontSize={"1rem"}>{PRODUCT_LABEL.supplier}</Typography>
          </BadgeLabel>
          <Divider />
          <List sx={{ maxHeight: 300, overflowY: "auto" }}>
            {supplierOptions.map((s, index) => (
              <ListItem
                key={index}
                sx={{ p: 1 }}
                onClick={() => handleChangeSupplierParams(index, s.value)}
              >
                <Checkbox
                  sx={{ paddingY: 0, paddingX: 1 }}
                  checked={!!(params.supplier as string[])?.[index]}
                  onClick={() => handleChangeSupplierParams(index, s.value)}
                />
                <Typography fontSize={"0.8125rem"}>{s.label}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}
      <Box bgcolor={(theme) => theme.palette.background.neutral} p={1} borderRadius={1}>
        <Typography fontSize={"1rem"}>{PRODUCT_LABEL.status}</Typography>
        <Divider />
        <RadioGroup
          aria-labelledby="status-radio-buttons"
          name="radio-buttons-group-status"
          value={params.is_active?.toString() || ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, is_active: (event.target as HTMLInputElement).value });
          }}
        >
          <FormControlLabel value="true" control={<Radio />} label={PRODUCT_LABEL.is_active} />
          <FormControlLabel value="false" control={<Radio />} label={PRODUCT_LABEL.inactive} />
        </RadioGroup>
      </Box>
      <Box bgcolor={(theme) => theme.palette.background.neutral} p={1} borderRadius={1}>
        <Typography fontSize={"1rem"}>{PRODUCT_LABEL.total_inventory}</Typography>
        <Divider />
        <SliderFilter
          inputFormatFunc={fNumber}
          step={STEP}
          rangeSliceArr={[
            { label: "0", value: 0 },
            { label: fNumber(TOTAL_INVENTORY_MAX), value: TOTAL_INVENTORY_MAX },
          ]}
          setSliceValue={([min, max]) => {
            setParams?.({ ...params, total_inventory_min: min, total_inventory_max: max });
          }}
          slide={[
            (params?.total_inventory_min as number) || 0,
            (params?.total_inventory_max as number) || 0,
          ]}
        />
      </Box>
    </Stack>
  );
};

export default DrawerFilterContent;
