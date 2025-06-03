import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LABEL } from "constants/label";
import map from "lodash/map";
import { TAddress } from "types/Address";
import { TStyles } from "types/Styles";
import { addressToString } from "utils/customer/addressToString";

type Props = {
  addresses?: TAddress[];
  handleUpdateAddress: (address: TAddress) => void;
};

const ListAddessLabel = (props: Props) => {
  const { addresses, handleUpdateAddress } = props;

  return (
    <Box sx={{ maxHeight: 480, overflow: "auto" }}>
      {map(addresses, (item) => {
        return (
          <Stack spacing={0.5} direction="column" key={item.id} sx={{ mb: 2 }}>
            <FormControlLabel
              sx={{
                ".MuiTypography-root": {
                  fontSize: "0.82rem",
                },
                color: item.is_default ? "primary.main" : "unset",
              }}
              key={item.id}
              value={item.id?.toString()}
              control={<li />}
              label={<Typography fontSize="0.82rem">{addressToString(item)}</Typography>}
            />
            {!item.is_default && (
              <Typography
                color="secondary"
                fontSize="0.82rem"
                textAlign="end"
                style={styles.addressItemDefaultLabel}
                onClick={() => handleUpdateAddress(item)}
              >
                {LABEL.SET_DEFAULT}
              </Typography>
            )}
          </Stack>
        );
      })}
    </Box>
  );
};

export default ListAddessLabel;

const styles: TStyles<"addressItemDefaultLabel"> = {
  addressItemDefaultLabel: { cursor: "pointer", marginLeft: 32, marginTop: 0 },
};
