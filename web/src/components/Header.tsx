import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="w-full bg-base-100 shadow-md">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-10">
                    {user && (
                        <span className="font-semibold text-sm">
                            {user.username}
                            {user.role === "admin" && (
                                <span className="ml-2 badge badge-primary">Admin</span>
                            )}
                        </span>
                    )}

                    {user && (
                        <button
                            onClick={logout}
                            className="btn btn-sm btn-outline"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* RIGHT */}
                <nav className="flex items-center gap-10 text-sm font-medium">
                    <Link to="/form" className="link link-hover">
                        Formulaire calories
                    </Link>

                    <Link to="/list" className="link link-hover">
                        Liste des calories
                    </Link>

                    <Link to="/summary" className="link link-hover">
                        Bilan calories
                    </Link>

                    {user?.role === "admin" && (
                        <Link
                            to="/admin/templates"
                            className="link link-hover text-primary font-semibold"
                        >
                            Admin Templates
                        </Link>
                    )}
                </nav>

            </div>
        </header>
    );
};
