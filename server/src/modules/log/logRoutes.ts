import { Router } from "express";
import { ObjectId } from "mongodb";
import Joi from "joi";

import { authMiddleware, JwtPayload } from "../auth/jwt";
import {
    createLog,
    deleteLogById,
    getLogsByUser,
    getLogSummaryByUser,
} from "./logModels";

export const logRoutes = Router();

logRoutes.use(authMiddleware);

const createBodySchema = Joi.object({
    label: Joi.string().required(),
    calories: Joi.number().required(),
    type: Joi.string().valid("entry", "expense").required(),
});

// ✅ GET /logs?sort=asc|desc
logRoutes.get("/", async (request, response) => {
    const { userId } = (request as any).auth as JwtPayload;
    const sort = request.query.sort === "asc" ? "asc" : "desc";

    const logs = await getLogsByUser(new ObjectId(userId), sort);
    response.json(logs);
});

// ✅ POST /logs
logRoutes.post("/", async (request, response) => {
    const { error, value } = createBodySchema.validate(request.body);
    if (error) return response.status(400).json({ error: error.message });

    const { userId } = (request as any).auth as JwtPayload;

    try {
        const created = await createLog({
            userId: new ObjectId(userId),
            label: value.label,
            calories: value.calories,
            type: value.type,
        });

        response.status(201).json(created);
    } catch (e: any) {
        response.status(400).json({ error: e.message });
    }
});

// ✅ DELETE /logs/:id
logRoutes.delete("/:id", async (request, response) => {
    const { userId } = (request as any).auth as JwtPayload;
    const { id } = request.params;

    try {
        const result = await deleteLogById(id, new ObjectId(userId));

        if (result.deletedCount === 0) {
            return response.status(404).json({ error: "Introuvable" });
        }

        response.json({ ok: true });
    } catch {
        response.status(400).json({ error: "ID invalide" });
    }
});

// ✅ GET /logs/summary
logRoutes.get("/summary", async (request, response) => {
    const { userId } = (request as any).auth as JwtPayload;

    const summary = await getLogSummaryByUser(new ObjectId(userId));
    response.json(summary);
});
