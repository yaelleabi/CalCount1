import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type CalorieEntry = {
    id: string;
    label: string;
    calories: number;
    type: "entry" | "expense";
    createdAt?: string;
};

type CalorieContextType = {
    entries: CalorieEntry[];
    addEntry: (entry: CalorieEntry) => Promise<void> | void;
    removeEntry: (id: string) => Promise<void> | void;
    fetchEntries: (sort?: "asc" | "desc") => Promise<void> | void;
};

export const CalorieContext = createContext<CalorieContextType>({
    entries: [],
    addEntry: () => { },
    removeEntry: () => { },
    fetchEntries: () => { },
});

export const CalorieProvider = ({ children }: PropsWithChildren) => {
    const [entries, setEntries] = useState<CalorieEntry[]>([]);
    const { token } = useAuth();

    const fetchEntries = async (sort: "asc" | "desc" = "desc") => {
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/logs?sort=${sort}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const dataFromDb = await response.json();

            const formattedEntries = dataFromDb.map((item: any) => ({
                ...item,
                id: item._id,
            }));

            setEntries(formattedEntries);
            console.log("✅ Logs chargés :", formattedEntries);
        } catch (error) {
            console.error("❌ Impossible de charger la liste :", error);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchEntries("desc");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const addEntry = async (entry: CalorieEntry) => {
        if (!token) return;

        const { id, createdAt, ...dataToSend } = entry;

        try {
            const response = await fetch("http://localhost:3000/logs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // le back renvoie l'objet créé (avec createdAt + _id)
            const saved = await response.json();

            const newEntryForFront: CalorieEntry = {
                ...saved,
                id: saved._id || saved.id,
            };

            setEntries((current) => [newEntryForFront, ...current]);
            console.log("✅ Log sauvegardé !", saved);
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi :", error);
            alert("Impossible de sauvegarder : vérifie que le serveur tourne !");
        }
    };

    const removeEntry = async (id: string) => {
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/logs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Erreur serveur lors de la suppression");

            setEntries((current) => current.filter((e) => e.id !== id));
            console.log(`✅ Log ${id} supprimé`);
        } catch (error) {
            console.error("❌ Erreur lors de la suppression :", error);
            alert("Impossible de supprimer l'entrée.");
        }
    };

    return (
        <CalorieContext.Provider value={{ entries, addEntry, removeEntry, fetchEntries }}>
            {children}
        </CalorieContext.Provider>
    );
};

export const useCalories = () => {
    return useContext(CalorieContext);
};
