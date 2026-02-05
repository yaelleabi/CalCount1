import { useEffect, useState } from "react";
import { useCalories } from "../contexts/CalorieContext";

export const CalorieList = () => {
    const { entries, removeEntry, fetchEntries } = useCalories();
    const [sort, setSort] = useState<"desc" | "asc">("desc");

    useEffect(() => {
        fetchEntries(sort);
    }, [sort]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Liste des Calories</h2>

                <div className="flex items-center gap-3">
                    <span className="text-sm opacity-70">Trier :</span>
                    <select
                        className="select select-bordered select-sm"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                    >
                        <option value="desc">Plus récent</option>
                        <option value="asc">Plus ancien</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                {entries.length === 0 ? (
                    <div className="text-center p-6">Aucune entrée pour le moment.</div>
                ) : (
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Label</th>
                                <th className="p-4">Calories</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry) => (
                                <tr key={entry.id}>
                                    <td className="p-4">
                                        {entry.createdAt
                                            ? new Date(entry.createdAt).toLocaleString()
                                            : "-"}
                                    </td>

                                    <td className="p-4">{entry.label}</td>

                                    <td className="font-bold p-4">{entry.calories} kcal</td>

                                    <td className="p-4">
                                        {entry.type === "entry" ? (
                                            <span className="badge badge-success">Apport</span>
                                        ) : (
                                            <span className="badge badge-warning">Dépense</span>
                                        )}
                                    </td>

                                    <td className="p-4 text-right">
                                        <button
                                            onClick={async () => {
                                                await removeEntry(entry.id);
                                                await fetchEntries(sort);
                                            }}
                                            className="btn btn-error btn-xs"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
