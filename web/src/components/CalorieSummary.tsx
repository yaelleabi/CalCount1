import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCalories } from "../contexts/CalorieContext";

type SummaryResponse = {
    totalConsumed: number;
    totalBurned: number;
    balance: number;
};

export const CalorieSummary = () => {
    const { token } = useAuth();
    const { entries } = useCalories();

    const [summary, setSummary] = useState<SummaryResponse>({
        totalConsumed: 0,
        totalBurned: 0,
        balance: 0,
    });

    const [loading, setLoading] = useState(false);

    const fetchSummary = async () => {
        if (!token) return;
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/logs/summary", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = (await res.json()) as SummaryResponse;
            setSummary(data);
        } catch (e) {
            console.error("❌ Impossible de charger le bilan", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        // refresh dès qu'on ajoute/supprime (entries change)
    }, [token, entries.length]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Bilan calories</h2>
                <p className="text-sm opacity-70 mt-1">
                    Totaux calculés à partir de vos logs
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="text-sm opacity-70">Total consommé</div>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : `${summary.totalConsumed} kcal`}
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="text-sm opacity-70">Total dépensé</div>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : `${summary.totalBurned} kcal`}
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="text-sm opacity-70">Bilan</div>
                        <div className="text-2xl font-bold">
                            {loading ? "..." : `${summary.balance} kcal`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button className="btn btn-outline btn-sm" onClick={fetchSummary}>
                    Rafraîchir
                </button>
            </div>
        </div>
    );
};
