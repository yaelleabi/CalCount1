import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const LoginForm = () => {

    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className="flex flex-col">
            <h2>Login Form</h2>
            <form className="flex flex-col gap-4" onSubmit={(e) => {
                e.preventDefault()
                login(email, password)
            }}>
                <input name="email" type="email" placeholder="Votre email" value={email} onChange={e => setEmail(e.target.value)} />
                <input name="password" type="password" placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="btn" type="submit">Se connecter</button>
            </form>
        </div>
    );
};
