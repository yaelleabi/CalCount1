// src/components/RegisterForm.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export function RegisterForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Ajuste selon ton projet :
    // - si tu as VITE_API_URL, garde ça
    // - sinon remplace par "http://localhost:3000" (ou ton port)
    const API_URL = import.meta.env.VITE_API_URL || "";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        // validations front
        if (username.trim().length < 3) {
            return setError("Le nom d'utilisateur doit faire au moins 3 caractères.");
        }
        if (password.length < 6) {
            return setError("Le mot de passe doit faire au moins 6 caractères.");
        }
        if (password !== confirmPassword) {
            return setError("Les mots de passe ne correspondent pas.");
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // ton backend renvoie { error: "..." }
                throw new Error(data?.error || "Erreur lors de l'inscription.");
            }

            // auto-login : on stocke le token
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }

            // optionnel : stocker user
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            navigate("/logs"); // ou "/" selon tes routes
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erreur inconnue.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
            <h1>Créer un compte</h1>

            {error && (
                <div
                    style={{
                        background: "#ffe5e5",
                        border: "1px solid #ffb3b3",
                        padding: 10,
                        borderRadius: 8,
                        marginTop: 12,
                        marginBottom: 12,
                    }}
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gap: 6 }}>
                    <label>Nom d'utilisateur</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        placeholder="ex: yaelle"
                    />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="minimum 6 caractères"
                    />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <label>Confirmer le mot de passe</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="retape le mot de passe"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Création..." : "S'inscrire"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}
