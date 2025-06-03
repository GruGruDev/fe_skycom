import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { MButton, MButtonProps } from "components/Buttons";
import { BUTTON } from "constants/button";

const AddButton = ({
  visibled = true,
  label = BUTTON.ADD,
  ...props
}: {
  visibled?: boolean;
  label?: string;
} & Partial<MButtonProps>) => {
  return visibled ? (
    <Grid item>
      <MButton {...props}>
        <AddIcon />
        {label}
      </MButton>
    </Grid>
  ) : null;
};

export default AddButton;
