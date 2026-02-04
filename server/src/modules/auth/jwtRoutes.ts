import { Router } from "express";
import Joi from "joi";
import { validator } from "../../validator";
import { createAuthToken } from "./jwt";

export const authRoutes = Router();

export type LoginData = {
    username: string;
    password: string;
};
const loginInfoDataSchema = Joi.object<LoginData>({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

authRoutes.post(
    "/login",
    validator.body(loginInfoDataSchema),
    async (request, response) => {
        const { username, password } = request.body as LoginData;
        if (username === "admin" && password === "admin") {
            const token = createAuthToken({ userId: "1" });
            response.json({ token });
        } else {
            response.status(401).json({ message: "Invalid credentials" });
        }
    },
);
