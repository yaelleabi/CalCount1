import { Router } from "express";
import { validator } from "../../validator";
import { ObjectId } from "mongodb";

import { User, userSchema, usersCollection } from "./userModels";
import { authMiddleware, JwtPayload } from "../auth/jwt";

export const userRoutes = Router();

/**
 * ✅ PUBLIC: créer un utilisateur (inscription)
 * POST /user
 */
userRoutes.post("/", validator.body(userSchema), async (request, response) => {
    const user = request.body as User;

    const exists = await usersCollection.findOne({ username: user.username });
    if (exists) return response.status(409).json({ error: "Username déjà utilisé" });

    // ✅ admin si username === "admin", sinon user
    const role = user.username === "admin" ? "admin" : "user";

    const result = await usersCollection.insertOne({
        ...user,
        role,
    });

    response.status(201).json({ id: result.insertedId, role });
});



/**
 * Tout ce qui est en dessous nécessite d'être connecté
 */
userRoutes.use(authMiddleware);

/**
 * ✅ PRIVÉ: récupérer SON compte
 * GET /user/me
 */
userRoutes.get("/me", async (request, response) => {
    const { userId } = (request as any).auth as JwtPayload;

    const me = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } } as any
    );

    if (!me) return response.status(404).json({ error: "User not found" });
    response.json(me);
});

/**
 * (Optionnel) delete user
 */
userRoutes.delete("/:id", async (request, response) => {
    const { id } = request.params;

    try {
        const mongoId = new ObjectId(id);
        const result = await usersCollection.deleteOne({ _id: mongoId });

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
