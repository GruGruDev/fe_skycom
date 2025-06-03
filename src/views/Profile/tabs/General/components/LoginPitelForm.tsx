import { yupResolver } from "@hookform/resolvers/yup";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { pitelApi } from "apis/pitel";
import { MButton } from "components/Buttons";
import { FormProvider, RHFTextField } from "components/HookFormFields";
import { PreviewImage } from "components/Images";
import { LABEL } from "constants/label";
import { VALIDATION_MESSAGE } from "constants/messages/validate.message";
import React from "react";
import { Resolver, useForm } from "react-hook-form";
import { PITEL_TOKEN_KEY, PITEL_USER_ID_KEY, getStorage, setStorage } from "utils/asyncStorage";
import * as Yup from "yup";

// ----------------------------------------------------------------------

interface PitelConfig {
  api_url: string;
  domain_name: string;
  domain_uuid: string;
  google_api_key: string;
  is_recording: boolean;
  logo: string;
  partner: string;
  payment_cost: number;
  type: string;
  version: string;
  zalo_api_key: string;
}

interface PitelUser {
  id: string;
  api_key: string;
  data_config: PitelConfig;
  domain_uuid: string;
  enable: boolean;
  extension: string;
  last_login_date: string;
  level: "agent" | "admin";
  token: {
    client_id: string;
    domain_uuid: string;
    expired_in: number;
    refresh_token: string;
    token: string;
    token_type: string;
    user_uuid: string;
  };
  user_uuid: string;
  username: string;
  // auth
  email?: string;
  password?: string;
}

const pittelAuthSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email(VALIDATION_MESSAGE.FORMAT_EMAIL)
    .required(VALIDATION_MESSAGE.REQUIRE_EMAIL),
  password: Yup.string().required(VALIDATION_MESSAGE.REQUIRE_PASSWORD),
});

const LoginPitelForm = () => {
  const pitelUserID = getStorage(PITEL_USER_ID_KEY);
  const methods = useForm<Partial<PitelUser>>({
    resolver: yupResolver(pittelAuthSchema) as Resolver<any, any>,
  });

  const { handleSubmit, reset } = methods;

  const login = async (form: Partial<PitelUser>) => {
    const data = JSON.stringify({ password: form.password, username: form.email });
    const res = await pitelApi.create<PitelUser>({ data, endpoint: "auth" });

    if (res.data) {
      const user = res.data;
      reset(res.data);
      setStorage(PITEL_TOKEN_KEY, res.data.token.token);
      setStorage(PITEL_USER_ID_KEY, user.user_uuid);
    }
  };

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <Card sx={{ p: 3, width: "100%", height: "100%" }}>
          <Grid container rowGap={3}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width="100%"
            >
              <PreviewImage
                src="https://documents.tel4vn.com/img/pitel-logo.png"
                height={"auto"}
                width={"8rem"}
                // eslint-disable-next-line no-inline-styles/no-inline-styles
                style={{ boxShadow: "unset", maxWidth: "8rem" }}
              />

              {!!pitelUserID ? (
                <Chip label={LABEL.LOGGED_IN} color="primary" />
              ) : (
                <Chip label={LABEL.NOT_LOGIN} />
              )}
            </Stack>
            <RHFTextField name="email" label="Email" type="email" />
            <RHFTextField name="password" label={LABEL.PASSWORD} type="password" />
            <Stack justifyContent="flex-end" direction={"row"} width={"100%"}>
              <MButton
                variant="contained"
                onClick={handleSubmit(login)}
                type="submit"
                disabled={!!pitelUserID}
              >
                {LABEL.LOGIN}
              </MButton>
            </Stack>
          </Grid>
        </Card>
      </FormProvider>
    </React.Fragment>
  );
};

export default LoginPitelForm;
