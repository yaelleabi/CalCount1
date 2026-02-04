import { createContext, type PropsWithChildren, useContext, useState } from "react";

export type User = {
    id: string;
    email: string;
    password: string;
};

export type AuthContextType = {
    user?: User;
    login: (email: string, password: string) => boolean;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    login: () => false,
    logout: () => { },
});

const USERS: User[] = [
    {
        id: "1",
        email: "user@example.com",
        password: "password123",
    },
    {
        id: "2",
        email: "admin@example.com",
        password: "password123",
    },
];

export const AuthProvider = ({ children }: PropsWithChildren) => {

    const [user, setUser] = useState<User>();

    return (
        <AuthContext.Provider
            value={{
                user,
                logout: () => {
                    setUser(undefined);
                },
                login: (email: string, password: string) => {
                    const user = USERS.find(
                        (u) => u.email === email && u.password === password
                    );
                    if (user) {
                        setUser(user);
                        return true;
                    }
                    return false;
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
