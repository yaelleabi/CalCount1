import { type PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "./LoginForm";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();

    return user ? children : <LoginForm />;
};
