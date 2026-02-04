import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Header = () => {
    const { user, logout } = useAuth();
    return (
        <div className="flex flex-row gap-4" style={{ display: 'flex', gap: '20px' }}>
            {user ? (
                <>
                    <span>{user.email}</span>
                    <button
                        onClick={logout}
                        className="m-4 inline-block text-blue-500 underline"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <Link to="/" className="m-4 inline-block text-blue-500 underline">
                    Login
                </Link>
            )}
            <Link to="/form" className="m-4 inline-block text-blue-500 underline">
                Formulaire calories
            </Link>
            <Link to="/list" className="m-4 inline-block text-blue-500 underline">
                Liste des calories
            </Link>
            <Link to="/summary" className="m-4 inline-block text-blue-500 underline">
                Bilan calories
            </Link>
        </div>
    );
};
