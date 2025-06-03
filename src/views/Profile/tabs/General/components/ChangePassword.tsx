import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { FormDialog } from "components/Dialogs";
import { FormProvider, RHFTextField } from "components/HookFormFields";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import { USER_LABEL } from "constants/user/label";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { updateUser } from "store/redux/users/action";
import { NOTIFICATION_TYPE, showToast } from "utils/toast";
import { userChangePasswordSchema } from "validations/userChangePassword";

// ----------------------------------------------------------------------

type FormValuesProps = {
  id?: string;
  roleId: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword = ({ onClose, open }: { open: boolean; onClose: () => void }) => {
  const { user = {} } = useAuth();
  const [isShowPassword, setShowPassword] = useState(true);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(true);

  const { id = "" } = user || {};

  const defaultValues = {
    id,
    newPassword: "",
    confirmNewPassword: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(userChangePasswordSchema) as Resolver<any, any>,
    defaultValues,
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = async (dataForm: FormValuesProps) => {
    if (dataForm.newPassword !== dataForm.confirmNewPassword) {
      setError("confirmNewPassword", { message: VALIDATION_MESSAGE.PASSWORD_NOT_MATCH });

      return;
    }

    const objData = {
      password: dataForm.newPassword,
      group_permission: {
        id: dataForm.roleId,
      },
      id: dataForm.id,
    };

    updateUser(objData);

    showToast({
      message: USER_LABEL.update_account_success,
      variant: NOTIFICATION_TYPE.SUCCESS,
    });
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        title={USER_LABEL.change_password}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2}>
          <RHFTextField
            name="newPassword"
            type={isShowPassword ? "password" : "text"}
            placeholder={USER_LABEL.enter_new_password}
            label={USER_LABEL.new_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!isShowPassword)}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <RHFTextField
            name="confirmNewPassword"
            type={isShowConfirmPassword ? "password" : "text"}
            placeholder={USER_LABEL.re_enter_new_password}
            label={USER_LABEL.confirm_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!isShowConfirmPassword)}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
            {BUTTON.SAVE}
          </LoadingButton>
        </Stack> */}
      </FormDialog>
    </FormProvider>
  );
};

export default ChangePassword;
