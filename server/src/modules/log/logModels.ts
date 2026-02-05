import Joi from "joi";
import { ObjectId } from "mongodb";
import { db } from "../../db";

export type LogEntry = {
    userId: ObjectId;
    label: string;
    calories: number;
    type: "entry" | "expense";
    createdAt: Date;
};

/**
 * Validation Joi
 */
export const logEntrySchema = Joi.object<LogEntry>({
    userId: Joi.any().required(), // ObjectId
    label: Joi.string().required(),
    calories: Joi.number().required(),
    type: Joi.string().valid("entry", "expense").required(),
    createdAt: Joi.date().required(),
});

/**
 * Collection Mongo
 */
export const logCollection = db.collection<LogEntry>("logs");

/**
 * Helpers (optionnels mais utiles)
 */
export const createLog = async (entry: Omit<LogEntry, "createdAt">) => {
    const log: LogEntry = {
        ...entry,
        createdAt: new Date(),
    };

    const { error } = logEntrySchema.validate(log);
    if (error) throw error;

    await logCollection.insertOne(log);
    return log;
};

export const deleteLogById = async (id: string, userId: ObjectId) => {
    return logCollection.deleteOne({
        _id: new ObjectId(id),
        userId,
    });
};

export const getLogsByUser = async (
    userId: ObjectId,
    sort: "asc" | "desc" = "desc"
) => {
    return logCollection
        .find({ userId })
        .sort({ createdAt: sort === "asc" ? 1 : -1 })
        .toArray();
};

export const getLogSummaryByUser = async (userId: ObjectId) => {
    const result = await logCollection
        .aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$calories" },
                },
            },
        ])
        .toArray();

    const totalConsumed =
        result.find((r) => r._id === "entry")?.total || 0;
    const totalBurned =
        result.find((r) => r._id === "expense")?.total || 0;

    return {
        totalConsumed,
        totalBurned,
        balance: totalConsumed - totalBurned,
    };
};
