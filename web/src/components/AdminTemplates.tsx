import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

type Template = {
    _id: string;
    name: string;
    calories: number;
    type: "entry" | "expense";
};

export const AdminTemplates = () => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [name, setName] = useState("");
    const [calories, setCalories] = useState<number | string>("");
    const [type, setType] = useState<"entry" | "expense">("entry");

    const fetchTemplates = async () => {
        const res = await fetch("http://localhost:3000/templates", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTemplates(data);
    };

    useEffect(() => {
        if (!token) return;
        fetchTemplates();
    }, [token]);

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("http://localhost:3000/templates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                calories: Number(calories),
                type,
            }),
        });

        setName("");
        setCalories("");
        setType("entry");
        fetchTemplates();
    };

    const onDelete = async (id: string) => {
        await fetch(`http://localhost:3000/templates/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        fetchTemplates();
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 px-4">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-6">Admin — Templates</h2>

                    <form onSubmit={onCreate} className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                className="input input-bordered w-full"
                                placeholder="Nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <input
                                className="input input-bordered w-full"
                                type="number"
                                placeholder="Calories"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                className="select select-bordered w-full"
                                value={type}
                                onChange={(e) => setType(e.target.value as "entry" | "expense")}
                            >
                                <option value="entry">Apport</option>
                                <option value="expense">Dépense</option>
                            </select>

                            <button className="btn btn-primary w-full sm:w-48" type="submit">
                                Ajouter
                            </button>
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Calories</th>
                                    <th>Type</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((t) => (
                                    <tr key={t._id}>
                                        <td>{t.name}</td>
                                        <td>{t.calories}</td>
                                        <td>{t.type}</td>
                                        <td className="text-right">
                                            <button className="btn btn-sm btn-error" onClick={() => onDelete(t._id)}>
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {templates.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="opacity-60">
                                            Aucun template
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};
