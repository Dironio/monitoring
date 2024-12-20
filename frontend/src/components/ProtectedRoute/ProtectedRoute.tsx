import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    user: any;
    loading: boolean;
    redirectTo?: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    user,
    loading,
    redirectTo = "/auth",
    children,
}) => {
    if (loading) {
        return <p>Загрузка...</p>;
    }

    return user ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;