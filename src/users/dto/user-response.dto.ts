import { Exclude, Expose } from "class-transformer";

export class UserResponseDTO {
    @Expose()
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

    constructor (partial: Partial<UserResponseDTO>) {
        Object.assign(this, partial);
    }

}