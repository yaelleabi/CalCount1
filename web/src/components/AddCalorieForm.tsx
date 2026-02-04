import { useState } from "react";
import { useCalories } from "../contexts/CalorieContext";
import { Row } from "./Layout";

export const AddCalorieForm = () => {
    const { addEntry } = useCalories();
    const [label, setLabel] = useState<string>("");
    const [calories, setCalories] = useState<number | string>(""); // String ou nombre pour faciliter la saisie
    const [type, setType] = useState<'entry' | 'expense'>('entry');

    return (
        <div className="p-4 border my-4">
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
                className="flex flex-col gap-4"
            >
                {/* --- NOUVEAU BLOC : LE TYPE --- */}
                <Row label="Type">
                    <select
                        className="input" // On garde ton style
                        value={type}
                        onChange={(e) => setType(e.target.value as 'entry' | 'expense')}
                    >
                        <option value="entry">🍔 Apport (Repas)</option>
                        <option value="expense">🏃‍♂️ Dépense (Sport)</option>
                    </select>
                </Row>

                <Row label="Aliment">
                    <input
                        name="label"
                        required
                        type="text"
                        placeholder="aliment"
                        className="input"
                        value={label}
                        onChange={(e) => {
                            setLabel(e.target.value);
                        }}
                    />
                </Row>
                <Row label="Calories">
                    <input
                        name="calories"
                        type="number"
                        required
                        placeholder="calories"
                        className="input"
                        value={calories}
                        onChange={(e) => {
                            setCalories(e.target.value);
                        }}
                    />
                </Row>
                <button className="btn btn-success" type="submit">
                    Envoyer
                </button>

            </form>
        </div>
    );
};