import { createContext, type PropsWithChildren, useContext, useState } from "react";

export type User = {
    id: string;
    username: string;
};

export type AuthContextType = {
    user?: User;
    token?: string;
    login: (token: string, user: User) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    // Initialize state from localStorage
    const [user, setUser] = useState<User | undefined>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : undefined;
    });

    const [token, setToken] = useState<string | undefined>(() => {
        return localStorage.getItem("jwt_token") || undefined;
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                logout: () => {
                    setUser(undefined);
                    setToken(undefined);
                    localStorage.removeItem("user");
                    localStorage.removeItem("jwt_token");
                },
                login: (newToken: string, newUser: User) => {
                    setUser(newUser);
                    setToken(newToken);
                    localStorage.setItem("user", JSON.stringify(newUser));
                    localStorage.setItem("jwt_token", newToken);
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
