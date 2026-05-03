type FormFieldErrorProps = {
    error?: { message?: string }
}

const FormFieldError = ({ error }: FormFieldErrorProps) => {
 return (
    <>
       {error && <p className="text-destructive text-sm">{error.message}</p>}
    </>

 )
}

export default FormFieldError;