import Joi from "joi";
import { ObjectId } from "mongodb";
import { db } from "../../db";

export type User = {
    _id?: ObjectId;        // L'ID est géré automatiquement par MongoDB
    username: string;
    password: string;
    role: "user" | "admin";

};

// Validation des données (avant d'insérer en base)
export const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(), // Minimum 6 caractères pour la sécurité
    role: Joi.string().valid("user", "admin").default("user"),
});

// Accès direct à la collection "users" dans la base de données
export const usersCollection = db.collection<User>("users");