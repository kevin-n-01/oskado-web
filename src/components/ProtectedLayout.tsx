import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return null;
    if (!isSignedIn) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedLayout;
