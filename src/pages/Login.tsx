import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, useAuth } from "@clerk/react";
import type React from "react";
import { Navigate } from "react-router-dom";

const Login = (): React.ReactNode => {
    const { isSignedIn } = useAuth();
    if (isSignedIn) {
        return (
            <Navigate to='/dashboard' replace />
        )
    } else {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center border gap-4'>
                <h1 className='text-5xl text-center font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400'>Oskado</h1>
                <h2>Inventory Management App</h2>
                    <Show when="signed-out">
                        <div className='flex gap-4 pt-4'>
                            <Button className='min-w-24 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'><SignInButton /></Button>
                            <Button className='min-w-24 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'><SignUpButton /></Button>
                        </div>

                    </Show>
            </div>
        )
    }
}

export default Login;