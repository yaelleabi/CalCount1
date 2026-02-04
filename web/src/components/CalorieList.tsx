import { useCalories } from "../contexts/CalorieContext";

export const CalorieList = () => {
    const { entries, removeEntry } = useCalories();

    return (
        <div className="overflow-x-auto my-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Liste des Calories</h2>
            {entries.length === 0 ? (
                <div className="text-center p-4">Aucune entrée pour le moment.</div>
            ) : (
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="p-4">Label</th>
                            <th className="p-4">Calories</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.id}>
                                <td className="p-4">{entry.label}</td>
                                <td className="font-bold p-4">{entry.calories} kcal</td>
                                <td className="p-4">
                                    {entry.type === 'entry' ? (
                                        <span className="badge badge-success gap-2">Apport</span>
                                    ) : (
                                        <span className="badge badge-warning gap-2">Dépense</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => removeEntry(entry.id)}
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
    );
};
