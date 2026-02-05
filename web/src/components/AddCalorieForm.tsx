import { useState } from "react";
import { useCalories } from "../contexts/CalorieContext";
import { useTemplates } from "../hooks/useTemplates";

export const AddCalorieForm = () => {
    const { addEntry } = useCalories();
    const [label, setLabel] = useState<string>("");
    const [calories, setCalories] = useState<number | string>("");
    const [type, setType] = useState<'entry' | 'expense'>('entry');
    const entryTemplates = useTemplates("entry");
    const expenseTemplates = useTemplates("expense");


    return (
        <div className="max-w-xl mx-auto mt-16">
            <div className="card bg-base-100 shadow-2xl">
                <div className="card-body">

                    <div className="mb-10">
                        <h2 className="card-title">Ajouter une entrée</h2>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addEntry({
                                id: Date.now().toString(),
                                label,
                                calories: Number(calories),
                                type: type
                            });
                            setLabel("");
                            setCalories("");
                            setType("entry");
                        }}
                    >
                        {/* TYPE */}
                        <div className="mb-8">
                            <label className="label mb-3">
                                <span className="label-text">Type d'entrée</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={type}
                                onChange={(e) => setType(e.target.value as 'entry' | 'expense')}
                            >
                                <option value="entry">🍔 Apport (Repas)</option>
                                <option value="expense">🏃‍♂️ Dépense (Sport)</option>
                            </select>
                        </div>

                        {/* TEMPLATES */}
                        <div className="form-control mb-8">
                            <label className="label">
                                <span className="label-text">
                                    Templates ({type === "entry" ? "Apport" : "Dépense"})
                                </span>
                            </label>

                            <select
                                className="select select-bordered w-full"
                                defaultValue=""
                                key={type} // Force re-render on type change to reset selection
                                onChange={(e) => {
                                    const list = type === "entry" ? entryTemplates : expenseTemplates;
                                    const t = list.find((x) => x._id === e.target.value);
                                    if (!t) return;
                                    setLabel(t.name);
                                    setCalories(t.calories);
                                    // type is already set
                                }}
                            >
                                <option value="" disabled>
                                    Choisir un template ({type === "entry" ? entryTemplates.length : expenseTemplates.length} disp.)
                                </option>

                                {(type === "entry" ? entryTemplates : expenseTemplates).map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.name} ({t.calories} kcal)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* LABEL */}
                        <div className="mb-8">
                            <label className="label mb-3">
                                <span className="label-text">
                                    {type === "entry" ? "Aliment / Repas" : "Activité / Sport"}
                                </span>
                            </label>
                            <input
                                name="label"
                                required
                                type="text"
                                placeholder={type === "entry" ? "ex: Pomme, Sandwich..." : "ex: Jogging, Vélo..."}
                                className="input input-bordered w-full"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                            />
                        </div>

                        {/* CALORIES */}
                        <div className="mb-10">
                            <label className="label mb-3">
                                <span className="label-text">Calories</span>
                            </label>
                            <input
                                name="calories"
                                type="number"
                                required
                                placeholder="ex: 150"
                                className="input input-bordered w-full"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                            />
                        </div>

                        {/* BUTTON */}
                        <div className="flex justify-end mt-12">
                            <button
                                className="btn btn-success px-10"
                                type="submit"
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};
