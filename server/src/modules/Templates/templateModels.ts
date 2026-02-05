import Joi from "joi";
import { ObjectId } from "mongodb";
import { db } from "../../db";

export type LogTemplate = {
    _id?: ObjectId;
    name: string;
    calories: number;
    type: "entry" | "expense";
    createdAt: Date;
};

export const templateSchema = Joi.object<LogTemplate>({
    name: Joi.string().required(),
    calories: Joi.number().required(),
    type: Joi.string().valid("entry", "expense").required(),
    createdAt: Joi.date().required(),
});

export const templatesCollection = db.collection<LogTemplate>("templates");
