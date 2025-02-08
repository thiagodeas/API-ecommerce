import { Role } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class UserResponseDTO {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Exclude()
    password: string;

    @Expose()
    role: Role;

    constructor (partial: Partial<UserResponseDTO>) {
        Object.assign(this, partial);
    }

}