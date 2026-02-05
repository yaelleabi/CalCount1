import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type LoginResponse = {
    token: string;
    user: {
        id: string;
        username: string;
        role: "user" | "admin";
    };
};

export const LoginForm = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Identifiants incorrects");
            }

            const data: LoginResponse = await response.json();

            // Use context to login (this updates state and localStorage)
            login(data.token, {
                id: data.user.id,
                username: data.user.username,
                role: data.user.role,
            });

            navigate("/list");

        } catch (err) {
            setError("Erreur : " + (err as Error).message);
        }
    };

    return (

        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-4">Connexion</h2>

                    {error && (
                        <div className="alert alert-error text-sm py-2 mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Nom d'utilisateur</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Entrez votre nom d'utilisateur"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Entrez votre mot de passe"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary to-blue-600">Se connecter</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};
