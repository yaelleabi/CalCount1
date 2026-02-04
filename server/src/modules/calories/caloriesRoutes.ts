import { Router } from "express";
import { validator } from "../../validator";
import { ObjectId } from "mongodb";



import {
    CalorieEntry,
    calorieEntrySchema,
    calorieEntryCollection,
} from "./caloriesModels";
// import { authMiddleware, JwtPayload } from "../auth/jwt";

export const caloriesRoutes = Router();

// caloriesRoutes.use(authMiddleware);

// caloriesRoutes.get("/", async (request, response) => {
//     // const { userId } = (request as any).auth as JwtPayload
//     // console.log(`User ${userId} is fetching appliances`)
//     const result = await calorieEntryCollection.find().toArray();
//     response.json(result);
// });
// Route pour RECUPERER les données (GET) avec un filtre
caloriesRoutes.get("/", async (request, response) => {
    const { type } = request.query;
    let filter = {};
    if (type) {
        filter = { type: type };
    }
    try {
        const result = await calorieEntryCollection.find(filter).toArray();
        response.json(result);
    } catch (error) {
        response.status(500).json({ error: "Erreur lors de la lecture des données" });
    }
});

caloriesRoutes.post(
    "/",
    validator.body(calorieEntrySchema),
    async (request, response) => {
        const calorieEntry = request.body as CalorieEntry;
        const result = await calorieEntryCollection.insertOne(calorieEntry);
        response.json({ id: result.insertedId });
    },
);
caloriesRoutes.delete("/:id", async (request, response) => {
    // 1. On récupère l'ID qui est dans l'URL (ex: /calories/65abc123...)
    const { id } = request.params;

    try {
        // 2. On transforme le texte en "ObjectId" compréhensible par Mongo
        const mongoId = new ObjectId(id);

        // 3. On demande à Mongo de supprimer celui qui a cet ID
        const result = await calorieEntryCollection.deleteOne({ _id: mongoId });

        // 4. On vérifie si ça a marché
        if (result.deletedCount === 1) {
            response.json({ message: "Supprimé avec succès !" });
        } else {
            response.status(404).json({ message: "Introuvable" });
        }
    } catch (error) {
        console.error("Erreur suppression:", error);
        response.status(500).json({ message: "Erreur serveur" });
    }
});
