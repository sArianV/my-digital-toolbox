import { ZodError, ZodObject, ZodRawShape } from "zod";

type FormData = {
  [key: string]: string | number | boolean | FormData | FormData[] | unknown;
};

export type FormErrors = {
  [key: string]: string;
};

type Validator = ZodObject<ZodRawShape>;

type THasFormErrors = (formData: FormData, validator: Validator) => FormData;

type TZodError = {
  _errors?: string[];
  [key: string]: TZodError | string[] | undefined;
};

export const hasZodErrors: THasFormErrors = (formData, validator) => {
  try {
    validator.parse(formData);
    return {};
  } catch (error) {
    const zodError = error as ZodError;
    const formErrors: FormErrors = {};
    const zodErrors: TZodError = zodError.format();
    delete zodErrors._errors;

    Object.keys(zodErrors).forEach((key) => {
      const { _errors } = zodErrors[key] as TZodError;
      if (!_errors?.length) return {};

      const [firstError] = _errors;

      if (firstError) formErrors[key] = firstError;
    });

    return formErrors;
  }
};

/* 
    export const VALIDATOR = z.object({
        name: z.string().min(2, { message: "Nombre requerido" }),
    });

    const contactFormError = hasFormErrors(
        {name: "asd"},
        VALIDATOR,
    );
*/