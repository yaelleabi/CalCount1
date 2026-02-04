import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext";


// Notre définition d'une entrée (ce qu'on a vu juste avant)
export type CalorieEntry = {
    id: string;
    label: string;
    calories: number;
    type: 'entry' | 'expense';
}
type CalorieContextType = {
    entries: CalorieEntry[];                 // La lecture : la liste actuelle
    addEntry: (entry: CalorieEntry) => void; // L'écriture : la fonction pour ajouter
    removeEntry: (id: string) => void;
}
export const CalorieContext = createContext<CalorieContextType>({
    entries: [],
    addEntry: () => { },
    removeEntry: (id: string) => { }
});
export const CalorieProvider = ({ children }: PropsWithChildren) => {
    const [entries, setEntries] = useState<CalorieEntry[]>([])
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;

        // On lance l'appel au serveur
        fetch("http://localhost:3000/calories", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((dataFromDb) => {
                // IMPORTANT : Adaptation des données
                // Mongo nous renvoie "_id", mais notre application React utilise "id".
                // On fait une petite boucle pour corriger ça pour chaque élément.
                const formattedEntries = dataFromDb.map((item: any) => ({
                    ...item,
                    id: item._id, // On crée 'id' à partir de '_id'
                }));

                setEntries(formattedEntries);
                console.log("✅ Données chargées depuis le serveur :", formattedEntries);
            })
            .catch((error) => {
                console.error("❌ Impossible de charger la liste :", error);
            });
    }, [token]);

    return <CalorieContext.Provider value={{
        entries,
        addEntry: (entry: CalorieEntry) => {
            // 1. On sépare l'ID temporaire (généré par le front) du reste des données
            // Le serveur va créer son propre _id, donc on n'envoie pas 'id'
            const { id, ...dataToSend } = entry;

            // 2. On envoie la requête au serveur
            fetch("http://localhost:3000/calories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Erreur serveur");
                })
                .then((savedData) => {
                    // 3. SUCCÈS : Le serveur a répondu OK !
                    // savedData contient l'objet créé avec son vrai _id Mongo

                    // On met à jour l'affichage localement
                    // Astuce : Mongo renvoie "_id", mais ton front attend "id". On fait la conversion.
                    const newEntryForFront = {
                        ...entry,
                        id: savedData._id || savedData.id
                    };

                    setEntries((currentEntries) => [...currentEntries, newEntryForFront]);

                    console.log("✅ Sauvegardé en base de données !", savedData);
                })
                .catch((error) => {
                    console.error("❌ Erreur lors de l'envoi :", error);
                    alert("Impossible de sauvegarder : vérifie que le serveur tourne !");
                });
        },
        removeEntry: (id: string) => {
            // 1. On prépare l'URL avec l'ID à supprimer
            const url = `http://localhost:3000/calories/${id}`;

            // 2. On envoie la requête DELETE
            fetch(url, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        // 3. SUCCÈS : Le serveur a supprimé l'élément
                        // On met à jour l'affichage local
                        setEntries((currentEntries) =>
                            currentEntries.filter((entry) => entry.id !== id)
                        );
                        console.log(`✅ Entrée ${id} supprimée du serveur`);
                    } else {
                        throw new Error("Erreur serveur lors de la suppression");
                    }
                })
                .catch((error) => {
                    console.error("❌ Erreur lors de la suppression :", error);
                    alert("Impossible de supprimer l'entrée.");
                });
        },
    }}>
        {children}
    </CalorieContext.Provider>
}

export const useCalories = () => {
    return useContext(CalorieContext);
}

