import { UploadMultiFile } from "components/Uploads";
import { UploadMultiFileProps } from "components/Uploads/type";
import { Controller, UseFormReturn } from "react-hook-form";

// ----------------------------------------------------------------------

export interface RHFUploadMultiFileProps
  extends Omit<UploadMultiFileProps, "files" | "onSetDefault">,
    Partial<UseFormReturn<any, object>> {
  name: string;
  isSetDefault?: boolean;
}

export function RHFUploadMultiFile({
  name,
  accept,
  control,
  isSetDefault,
  ...other
}: RHFUploadMultiFileProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error } }) => {
        return (
          <UploadMultiFile
            accept={accept}
            files={field.value}
            error={error}
            onSetDefault={
              isSetDefault
                ? (index, value) => {
                    field.value[index].is_default = value;
                    field.onChange(field.value);
                  }
                : undefined
            }
            {...other}
          />
        );
      }}
    />
  );
}
