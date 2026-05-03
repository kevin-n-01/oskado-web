import type { FieldError } from "react-hook-form";

type FormFieldErrorProps = {
    error?: FieldError
}

const FormFieldError = ({ error }: FormFieldErrorProps) => {
 return (
    <>
       {error && <p className="text-destructive text-sm">{error.message}</p>}
    </>

 )
}

export default FormFieldError;