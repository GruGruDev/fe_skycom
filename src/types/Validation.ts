import { FieldError, FieldErrorsImpl, FieldValues, Merge } from "react-hook-form";
import { ObjectShape } from "yup/lib/object";

type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never;
export type Shape<T extends Record<any, any>> = Partial<Record<keyof T, ObjectShapeValues>>;

export type FieldErrorArray<T extends FieldValues> = Merge<FieldError, FieldErrorsImpl<T>>;
