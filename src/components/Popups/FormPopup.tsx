import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { FormDialog, FormDialogProps } from "components/Dialogs";
import { FormProvider } from "components/HookFormFields";
import { MDatePicker, MDatetimePicker } from "components/Pickers";
import { MSelectColor, MultiSelect } from "components/Selectors";
import { UploadMultiFile } from "components/Uploads";
import { TYPE_FORM_FIELD, ZINDEX_SYSTEM } from "constants/index";
import { LABEL } from "constants/label";
import isArray from "lodash/isArray";
import map from "lodash/map";
import { memo, useEffect, useState } from "react";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
  UseFormSetValue,
  UseFormStateReturn,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { TGridSize } from "types/GridLayout";
import { TSelectOption } from "types/SelectOption";
import { TStyles } from "types/Styles";
import { dirtyRHF } from "utils/formValidation";
import * as Yup from "yup";
import { AssertsShape } from "yup/lib/object";

//---------------------------------------------------------------

export const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export interface Methods {
  control: Control<FieldValues, object>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

export interface PropsContentRender {
  type?: string;
  name: string;
  label?: string;
  typeInput?: string;
  placeholder?: string;
  nameOptional?: string;
  required?: boolean;
  disabled?: boolean;
  simpleSelect?: boolean;
  size?: "small" | "medium";
  content?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<any, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<any>;
  }) => JSX.Element;
  options?: TSelectOption[];
  contentRender?: React.ReactNode;
  viewsDate?: any[];
  renderOptionTitleFunc?: ({
    idx,
    option,
    onClick,
  }: {
    option: TSelectOption;
    idx: number;
    onClick?: () => void;
  }) => React.ReactNode;
}
export interface FormPopupProps extends Omit<FormDialogProps, "onClose" | "open"> {
  fullScreen?: boolean;
  open?: boolean;
  transition?: boolean;
  isLoadingImage?: boolean;
  isDisabledSubmit?: boolean;
  isShowFooter?: boolean;
  buttonText?: string;
  maxWidth?: TGridSize;
  title?: string;
  zIndex?: number;
  style?: React.CSSProperties;
  defaultData?: any;
  loading?: boolean;
  funcContentSchema?: (yup: typeof Yup) => any;
  funcContentRender?: (
    methods: UseFormReturn<any, object>,
    optional: any,
  ) => JSX.Element | PropsContentRender[];
  handleClose: (form?: any) => void;
  handleSubmitPopup: (form: any, values?: AssertsShape<any>) => Promise<void> | void;
  handleDropImage?: (acceptedFiles: File[], methods: UseFormReturn<any, object>) => void;
  handleRemoveAllImage?: (methods: UseFormReturn<any, object>) => void;
  handleRemoveImage?: (
    file: { id: string; url: string },
    methods: UseFormReturn<any, object>,
  ) => void;
  optionalContent?: JSX.Element;
}

export const FormPopup = memo((props: FormPopupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    fullScreen,
    title,
    open = false,
    sizeTitle = "h5",
    isLoadingImage = false,
    buttonText = "",
    defaultData,
    style = {},
    loading = false,
    transition,
    isShowFooter = true,
    isEnterToSubmit,
    isDisabledSubmit,
    funcContentRender,
    funcContentSchema,
    maxWidth = "sm",
    handleClose,
    handleSubmitPopup,
    handleDropImage,
    handleRemoveAllImage,
    handleRemoveImage,
    optionalContent,
  } = props;

  const methods = useForm({
    resolver: yupResolver(
      Yup.object().shape(funcContentSchema ? funcContentSchema(Yup) : undefined),
    ),
  });

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    getValues,
    formState: { dirtyFields },
  } = methods;

  const values = getValues();

  useEffect(() => {
    if (open) {
      reset(defaultData);
    } else {
      reset({});
      clearErrors();
    }
  }, [open, clearErrors, reset, defaultData]);

  const renderHtml = () => {
    if (!open) return;

    const valueComponent = funcContentRender?.({ ...methods }, { ...props });
    if (isArray(valueComponent) && valueComponent.length) {
      return map(valueComponent, (item: PropsContentRender, index: number) => {
        const {
          disabled = false,
          simpleSelect = true,
          type,
          size,
          name,
          label,
          placeholder,
          options = [],
          typeInput = "text",
          nameOptional = "",
          required = false,
          viewsDate = ["day", "year", "month"],
          contentRender,
          renderOptionTitleFunc,
          content = () => {
            return;
          },
        } = item;

        let component;
        switch (type) {
          case TYPE_FORM_FIELD.TEXTFIELD: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    defaultValue={field.value}
                    {...field}
                    type={typeInput}
                    autoFocus={index === 0}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                  />
                )}
              />
            );
            break;
          }
          case TYPE_FORM_FIELD.PASSWORD: {
            component = (
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    defaultValue={field.value}
                    {...field}
                    fullWidth
                    autoComplete="on"
                    type={showPassword ? "text" : "password"}
                    required
                    error={!!error}
                    helperText={error?.message}
                    label={LABEL.PASSWORD}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            );
            break;
          }
          case TYPE_FORM_FIELD.MULTIPLE_SELECT: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <MultiSelect
                    {...field}
                    zIndex={ZINDEX_SYSTEM.selector}
                    style={styles.multiSelector}
                    title={label}
                    size="medium"
                    selectorId={`id${label}`}
                    fullWidth
                    outlined
                    error={error}
                    disabled={disabled}
                    options={options}
                    simpleSelect={simpleSelect}
                    required={required}
                    contentRender={contentRender}
                    placeholder={placeholder}
                    renderOptionTitleFunc={renderOptionTitleFunc}
                  />
                )}
              />
            );
            break;
          }
          case TYPE_FORM_FIELD.UPLOAD_IMAGE: {
            component = (
              <div className="relative">
                {label && <LabelStyle>{label}</LabelStyle>}
                <Controller
                  name={name}
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <UploadMultiFile
                        files={field.value}
                        error={error}
                        isMultiple={false}
                        showPreview
                        maxSize={2145728}
                        loading={isLoadingImage}
                        onDrop={(acceptedFiles: File[]) =>
                          handleDropImage?.(acceptedFiles, methods)
                        }
                        onRemove={(file: { id: string; url: string }) =>
                          handleRemoveImage?.(file, methods)
                        }
                        onRemoveAll={() => handleRemoveAllImage?.(methods)}
                      />
                    );
                  }}
                />
              </div>
            );
            break;
          }
          case TYPE_FORM_FIELD.COLOR: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Grid container direction="row" spacing={3} alignItems="center">
                      <Grid item xs={3} md={3}>
                        {label && <Typography variant="body2">{label}</Typography>}
                      </Grid>
                      <Grid item xs={2} md={2}>
                        <MSelectColor
                          color={field.value}
                          onChangeColor={(color: string) => field.onChange(color)}
                        />
                      </Grid>
                      <Grid item xs={7} md={7}>
                        {getValues(nameOptional) ? (
                          <Box>
                            <Chip
                              size="small"
                              label={getValues(nameOptional)}
                              sx={{
                                backgroundColor: field.value,
                                color: "#fff",
                              }}
                            />
                          </Box>
                        ) : null}
                      </Grid>
                    </Grid>
                    {error ? (
                      <Typography variant="body2" component="span" color="error" sx={{ mt: 1 }}>
                        {error?.message}
                      </Typography>
                    ) : null}
                  </>
                )}
              />
            );

            break;
          }
          case TYPE_FORM_FIELD.SWITCH: {
            component = (
              <Grid container direction="row" alignItems="center">
                <Typography component="span" variant="body2" sx={{ mr: 2 }}>
                  {label}
                </Typography>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => <Switch {...field} checked={field.value} />}
                />
              </Grid>
            );

            break;
          }
          case TYPE_FORM_FIELD.DATE: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <MDatePicker
                      views={viewsDate}
                      label={label}
                      minDate={new Date("01/03/2022")}
                      value={field.value}
                      onChange={(value: Date | string | null) => field.onChange(value)}
                      error={!!error}
                      helperText={error?.message}
                      size={size}
                    />
                  );
                }}
              />
            );

            break;
          }
          case TYPE_FORM_FIELD.DATE_TIME: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <MDatetimePicker
                    {...field}
                    label={label}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                )}
              />
            );
            break;
          }
          default: {
            component = (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState, formState }) => (
                  <>{content({ field, fieldState, formState })}</>
                )}
              />
            );
          }
        }

        return (
          <Box p={2} key={index}>
            <FormControl fullWidth>{component}</FormControl>
          </Box>
        );
      });
    } else {
      return valueComponent;
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        enableCloseByDropClick
        fullScreen={fullScreen}
        transition={transition}
        title={title}
        sizeTitle={sizeTitle}
        buttonText={buttonText}
        maxWidth={maxWidth}
        onClose={() => handleClose(values)}
        onSubmit={handleSubmit((form) => handleSubmitPopup(dirtyRHF(form, dirtyFields), values))}
        loading={loading}
        open={open}
        disabledSubmit={isDisabledSubmit || (!!defaultData?.id && !Object.keys(dirtyFields).length)}
        isShowFooter={isShowFooter}
        contentStyle={style}
        isEnterToSubmit={isEnterToSubmit}
      >
        <FormGroup sx={{ "& > div": { padding: 1 } }}>
          <>{optionalContent || renderHtml()}</>
        </FormGroup>
      </FormDialog>
    </FormProvider>
  );
});

const styles: TStyles<"multiSelector"> = {
  multiSelector: { width: "100%", marginLeft: 0 },
};
