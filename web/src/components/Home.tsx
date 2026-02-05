import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="hero min-h-[calc(100vh-64px)] bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Bienvenue sur CalCount</h1>
                    <p className="py-6">
                        Gérez vos calories simplement et efficacement. Connectez-vous ou créez un compte pour commencer.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/login" className="btn btn-primary">Se connecter</Link>
                        <Link to="/register" className="btn btn-secondary">S'inscrire</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
