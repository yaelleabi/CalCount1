import { sign } from "jsonwebtoken";
import { expressjwt } from "express-jwt"

export type JwtPayload = {
    userId: string;
    role?: "user" | "admin";
};

const SECRET_KEY = "12345";
const ALGORITHM = "HS256";

export const createAuthToken = (payload: JwtPayload): string => {
    return sign(payload, SECRET_KEY, {
        algorithm: ALGORITHM,
    });
};

export const authMiddleware = expressjwt({
    secret: SECRET_KEY,
    algorithms: [ALGORITHM],
});