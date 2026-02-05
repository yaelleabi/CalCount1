import { Router } from "express";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { authMiddleware, JwtPayload } from "../auth/jwt";
import { templatesCollection, templateSchema } from "./templateModels";

export const templateRoutes = Router();

templateRoutes.use(authMiddleware);

const createBodySchema = Joi.object({
    name: Joi.string().required(),
    calories: Joi.number().required(),
    type: Joi.string().valid("entry", "expense").required(),
});

const updateBodySchema = Joi.object({
    name: Joi.string().optional(),
    calories: Joi.number().optional(),
    type: Joi.string().valid("entry", "expense").optional(),
}).min(1);

const requireAdmin = (req: any, res: any, next: any) => {
    const { role } = (req as any).auth as JwtPayload;
    if (role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
};

// ✅ GET /templates?type=entry|expense
templateRoutes.get("/", async (req, res) => {
    const { type } = req.query;

    const filter: any = {};
    if (type) filter.type = type;

    const templates = await templatesCollection.find(filter).sort({ name: 1 }).toArray();
    res.json(templates);
});

// ✅ POST /templates (admin)
templateRoutes.post("/", requireAdmin, async (req, res) => {
    const { error, value } = createBodySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const doc = { ...value, createdAt: new Date() };
    const { error: fullError } = templateSchema.validate(doc);
    if (fullError) return res.status(400).json({ error: fullError.message });

    const result = await templatesCollection.insertOne(doc);
    res.status(201).json({ id: result.insertedId });
});

// ✅ PUT /templates/:id (admin)
templateRoutes.put("/:id", requireAdmin, async (req, res) => {
    const { error, value } = updateBodySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    try {
        const _id = new ObjectId(req.params.id);

        const result = await templatesCollection.updateOne(
            { _id },
            { $set: value }
        );

        if (result.matchedCount === 0) return res.status(404).json({ error: "Introuvable" });

        const updated = await templatesCollection.findOne({ _id });
        res.json(updated);
    } catch {
        res.status(400).json({ error: "ID invalide" });
    }
});

// ✅ DELETE /templates/:id (admin)
templateRoutes.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const _id = new ObjectId(req.params.id);

        const result = await templatesCollection.deleteOne({ _id });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Introuvable" });

        res.json({ ok: true });
    } catch {
        res.status(400).json({ error: "ID invalide" });
    }
});
