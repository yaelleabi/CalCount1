import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { token, user } = useAuth();

    if (!token) return <Navigate to="/login" replace />;
    if (!user || user.role !== "admin") return <Navigate to="/form" replace />;

    return children;
};
