import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { LABEL } from "constants/label";
import useAuth from "hooks/useAuth";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { isEnterPress } from "utils/keyBoard";
import { loginSchema } from "validations/login";

//
interface LoginFormType {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema) as Resolver<any, any>,
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleEnterPress = (e: any) => {
    if (isEnterPress(e)) handleSubmit((form) => login({ ...form }));
  };

  return (
    <>
      <form onSubmit={handleSubmit(login)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            onChange={(e) => setValue("email", e.target.value, { shouldDirty: true })}
            error={!!errors.email}
            helperText={errors.email?.message}
            onKeyPress={handleEnterPress}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label={LABEL.PASSWORD}
            onChange={(e) => setValue("password", e.target.value, { shouldDirty: true })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Stack>

        <Stack py={2} />

        <LoadingButton
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          loading={isSubmitting}
        >
          {LABEL.LOGIN}
        </LoadingButton>
      </form>
    </>
  );
}
