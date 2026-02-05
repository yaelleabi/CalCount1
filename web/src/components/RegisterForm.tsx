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

    const API_URL = "http://localhost:3000";

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

            navigate("/list"); // ou "/" selon tes routes
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

        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-4">Créer un compte</h2>

                    {error && (
                        <div className="alert alert-error text-sm py-2 mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nom d'utilisateur</span>
                            </label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                placeholder="ex: yaelle"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="minimum 6 caractères"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirmer le mot de passe</span>
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="retape le mot de passe"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Création..." : "S'inscrire"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-4 text-sm">
                        Déjà un compte ? <Link to="/login" className="link link-primary">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );

}
