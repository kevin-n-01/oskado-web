import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/react";
import type React from "react";
import { Navigate } from "react-router-dom";

type HomePageButtonProps = {
    buttonLabel: string;
} & React.ComponentProps<typeof Button>;

const HomePageButton = ({ buttonLabel, ...rest}: HomePageButtonProps) => {
    return (
        <Button {...rest} className='min-w-24 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'>
            {buttonLabel}
        </Button>
    )
}
const Login = (): React.ReactNode => {
    const { isSignedIn } = useAuth();
    if (isSignedIn) {
        return (
            <Navigate to='/dashboard' replace />
        )
    } else {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center border gap-4'>
                <h1 className='text-6xl text-center font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400'>Oskado</h1>
                <h2>Inventory Management App</h2>
                        <div className='flex gap-4 pt-4'>
                            <SignInButton mode="modal"><HomePageButton buttonLabel="Sign In" /></SignInButton>
                            <SignUpButton mode="modal"><HomePageButton buttonLabel="Sign Up" /></SignUpButton>
                        </div>
            </div>
        )
    }
}

export default Login;