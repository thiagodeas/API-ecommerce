import { Role } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class UserResponseDTO {
    @Exclude()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    password: string;

    @Expose()
    role: Role;

    constructor (partial: Partial<UserResponseDTO>) {
        Object.assign(this, partial);
    }

}