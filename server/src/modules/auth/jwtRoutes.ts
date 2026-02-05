// jwtRoutes.ts
import { Router } from "express";
import Joi from "joi";
import { validator } from "../../validator";
import { createAuthToken } from "./jwt";
import { usersCollection } from "../user/userModels";

export const authRoutes = Router();

/**
 * LOGIN
 */
export type LoginData = {
    username: string;
    password: string;
};

const loginSchema = Joi.object<LoginData>({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

authRoutes.post("/login", validator.body(loginSchema), async (req, res) => {
    const { username, password } = req.body as LoginData;

    const user = await usersCollection.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = createAuthToken({
        userId: user._id!.toString(),
        role: user.role,
    });

    return res.json({
        token,
        user: {
            id: user._id!.toString(),
            username: user.username,
            role: user.role,
        },
    });
});

/**
 * REGISTER
 */
export type RegisterData = {
    username: string;
    password: string;
};

const registerSchema = Joi.object<RegisterData>({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

authRoutes.post("/register", validator.body(registerSchema), async (req, res) => {
    const { username, password } = req.body as RegisterData;

    // username unique
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ error: "Nom d'utilisateur déjà utilisé" });
    }

    const result = await usersCollection.insertOne({
        username,
        password, // ✅ en clair (comme tu veux)
        role: "user", // ✅ forcé côté backend
    });

    const userId = result.insertedId.toString();

    // auto-login après inscription
    const token = createAuthToken({
        userId,
        role: "user",
    });

    return res.status(201).json({
        token,
        user: {
            id: userId,
            username,
            role: "user",
        },
    });
});
