import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type LoginResponse = {
    token: string;
    // The server currently only returns token, so we construct the user client-side for now
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

            // Construct a user object since the backend only returns the token
            const user = { id: "1", username: username }; // infer based on success

            // Use context to login (this updates state and localStorage)
            login(data.token, user);

            navigate("/list");

        } catch (err) {
            setError("Erreur : " + (err as Error).message);
        }
    };

    return (
        <div style={{ maxWidth: "300px", margin: "auto", padding: "20px" }}>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Username :</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ display: "block", width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ display: "block", width: "100%" }}
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};
