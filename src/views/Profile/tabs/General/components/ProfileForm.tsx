import { yupResolver } from "@hookform/resolvers/yup";
import Card from "@mui/material/Card";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { fileApi } from "apis/file";
import { MButton } from "components/Buttons";
import { FormProvider, RHFTextField } from "components/HookFormFields";
import { Span } from "components/Texts";
import { UploadAvatar } from "components/Uploads";
import { CustomFile } from "components/Uploads/type";
import { BUTTON } from "constants/button";
import { LABEL } from "constants/label";
import { USER_LABEL } from "constants/user/label";
import useAuth from "hooks/useAuth";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { updateUser } from "store/redux/users/action";
import { IMAGE_TYPE, TImage } from "types/Media";
import { fData } from "utils/number";
import { NOTIFICATION_TYPE, showToast } from "utils/toast";
import { accountSchema } from "validations/account";

//----------------------------------------------------------------------
const MAX_IMAGE_WEIGHT = 3145728; //3MB
const IMAGE_EXTENSIONS = "*.jpeg, *.jpg, *.png, *.gif";

const avatarCaptionSx: SxProps<Theme> = {
  mt: 2,
  mx: "auto",
  display: "block",
  textAlign: "center",
  color: "text.secondary",
};
//----------------------------------------------------------------------
type FormValuesProps = {
  id?: string;
  email: string;
  phone?: string;
  name?: string;
  image?: { id: string; url: string } | CustomFile | any;
  imageApi?: string[];
  role?: string;
  roleId?: string;
  images?: Partial<TImage>[];
};

const ProfileForm = () => {
  const theme = useTheme();
  const { user, updateProfile, logout, getProfile } = useAuth();
  const [isLoadingImage, setLoadingImage] = useState(false);

  const defaultValues: FormValuesProps = useMemo(() => {
    const { email = "", name = "", phone = "", id, images } = user || {};

    return {
      id,
      email,
      name,
      phone,
      // role: user?.group_permission?.name,
      // roleId: user?.group_permission?.id,
      image: {
        id: images?.[0]?.id || "",
        url: images?.[0]?.image || "",
      },
      imageApi: images?.map((item) => item?.id || ""),
      images,
    };
  }, [user]);

  const methods = useForm<Partial<FormValuesProps>>({
    resolver: yupResolver<Partial<FormValuesProps>>(accountSchema) as Resolver<any, any>,
    defaultValues,
  });

  const { setValue, handleSubmit, control, reset, watch } = methods;
  const values = watch();

  const onSubmit = async (form: Partial<FormValuesProps>) => {
    const { name = "", phone = "", image, roleId, id } = form;
    const objData = {
      name,
      phone,
      group_permission: {
        id: roleId,
      },
      id: id,
    };

    updateUser(objData);

    updateProfile({ name, phone, image });

    showToast({
      message: USER_LABEL.update_account_success,
      variant: NOTIFICATION_TYPE.SUCCESS,
    });
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoadingImage(true);
      const result = await fileApi.uploadImage({
        endpoint: "images/",
        params: {
          image: acceptedFiles[0],
          user: user?.id,
          type: IMAGE_TYPE.US,
        },
      });

      if (result?.data) {
        const { data } = result;

        // xóa avatar cũ
        if (values.imageApi) {
          await Promise.all(
            values?.imageApi.map((id: string) => {
              return fileApi.remove({
                endpoint: `images/${id}/`,
              });
            }),
          );
        }

        setValue("imageApi", [data?.id], { shouldDirty: true });
        setValue("image", { id: data?.id, url: data.image }, { shouldDirty: true });

        getProfile();

        showToast({
          message: USER_LABEL.upload_image_success,
          variant: NOTIFICATION_TYPE.SUCCESS,
        });
      }

      setLoadingImage(false);
    },
    [setValue, user, values.imageApi, getProfile],
  );

  const handleLogout = async () => {
    await logout?.();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <Grid item xs={12} sm={6} md={4} xl={4}>
        <Card sx={{ py: 5, px: 9, textAlign: "center", width: "100%" }}>
          <Controller
            name="image"
            control={control}
            render={({ field, fieldState: { error } }) => {
              const checkError = !!error && !field.value;
              return (
                <div>
                  <UploadAvatar
                    error={checkError}
                    file={field.value}
                    maxSize={MAX_IMAGE_WEIGHT}
                    loading={isLoadingImage}
                    onDrop={handleDrop}
                    helperText={
                      <>
                        <Typography variant="caption" sx={avatarCaptionSx}>
                          {`${LABEL.ACCEPT} ${IMAGE_EXTENSIONS}`}
                          <br /> {`${LABEL.MAXIMUM} ${fData(3145728)}`}
                        </Typography>
                        <Typography variant="caption" sx={avatarCaptionSx}>
                          {LABEL.IMAGE_USED_TO_PREVIEW}
                        </Typography>
                      </>
                    }
                  />
                  {checkError && (
                    <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                      {error?.message}
                    </FormHelperText>
                  )}
                </div>
              );
            }}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Span
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color="primary"
                sx={{ mt: 3 }}
              >
                {field.value}
              </Span>
            )}
          />
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} xl={4}>
        <Card sx={{ p: 3, width: "100%", height: "100%" }}>
          <Stack spacing={2}>
            <RHFTextField name="name" label={USER_LABEL.name} />
            <RHFTextField name="email" label={USER_LABEL.email} disabled />
            <RHFTextField name="phone" label={USER_LABEL.phone} />
          </Stack>

          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <MButton
              type="submit"
              variant="contained"
              disabled={isEqual(defaultValues, values)}
              onClick={handleSubmit(onSubmit)}
            >
              {BUTTON.SAVE}
            </MButton>
          </Stack>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <MButton variant="contained" color="error" onClick={handleLogout}>
              {LABEL.LOGOUT}
            </MButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
};

export default ProfileForm;
