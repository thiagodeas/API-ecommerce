import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
    @ApiProperty({ description: 'Nome do usuário', example: 'Thiago Sousa' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'E-mail do usuário', example: 'thiago@exemplo.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Senha do usuário (mínimo 6 caracteres)', example: 'password123' })
    @MinLength(6)
    password: string;
}