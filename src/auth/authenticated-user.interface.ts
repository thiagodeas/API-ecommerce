import { Role } from "src/users/schemas/user.schema";

export interface AuthenticatedUser {
    id: number;
    email: string;
    role: Role;
}