import { Request } from "express";
import { Role, User } from "src/users/schemas/user.schema";

export interface AuthRequest extends Request {
    user: {
        id: string,
        email: string,
        role: Role,
    };
}