import Joi from "joi";
import { db } from "../../db";



export type CalorieEntry = {
    label: string;
    calories: number;
    type: 'entry' | 'expense';
};

export const calorieEntrySchema = Joi.object<CalorieEntry>({
    label: Joi.string().required(),
    calories: Joi.number().required(),
    type: Joi.string().valid('entry', 'expense').required()
});

export const calorieEntryCollection = db.collection<CalorieEntry>("calorieEntry");

// export const createCalorie = async (entry: CalorieEntry) => {
//     try {
//         await calorieEntryCollection.insertOne(entry);
//         return true;
//     } catch (error) {
//         console.error("Erreur lors de l'ajout :", error);
//         return false;
//     }
// };