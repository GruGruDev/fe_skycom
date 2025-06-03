import { ReactNode } from "react";
import { FormProvider as Form, UseFormReturn } from "react-hook-form";

// ----------------------------------------------------------------------

interface Props extends UseFormReturn<any, any, undefined> {
  children: ReactNode;
}

export default function FormProvider({ children, ...methods }: Props) {
  return <Form {...methods}>{children}</Form>;
}
