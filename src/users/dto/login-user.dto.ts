import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({ description: 'E-mail do usuário', example: 'thiago@exemplo.com' })
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
    password: string;
}