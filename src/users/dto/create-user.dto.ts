import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { Role } from '@prisma/client';

export class CreateUserDTO {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}