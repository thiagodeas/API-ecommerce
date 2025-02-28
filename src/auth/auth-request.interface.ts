import { Request } from "express";
import { User } from "src/users/schemas/user.schema";

export interface AuthRequest extends Request {
    user: User;
}