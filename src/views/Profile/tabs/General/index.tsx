import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { USER_LABEL } from "constants/user/label";
import { useState } from "react";
import ChangePassword from "./components/ChangePassword";
// import LoginPitelForm from "./components/LoginPitelForm";
import Report from "./components/Report";
import ProfileForm from "./components/ProfileForm";
import SearchCustomer from "./components/SearchCustomer";

// ----------------------------------------------------------------------

const AccountGeneral = () => {
  const [isShowChangePasswordModal, setShowChangePasswordModal] = useState(false);

  return (
    <Box width={"100%"}>
      <Stack mt={2} textAlign={"right"} direction={"row"} justifyContent={"end"} my={1}>
        <ChangePassword
          open={isShowChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
        <Button
          variant="text"
          sx={{ width: "fit-content" }}
          onClick={() => setShowChangePasswordModal(true)}
        >
          {USER_LABEL.change_password}
        </Button>
      </Stack>
      <Stack>
        <Grid container spacing={2} justifyContent={"center"}>
          <ProfileForm />
          <SearchCustomer />
          {/* <Grid item xs={12} md={4} lg={4}>
            <LoginPitelForm />
          </Grid> */}
        </Grid>
      </Stack>
      <Report />
    </Box>
  );
};

export default AccountGeneral;
