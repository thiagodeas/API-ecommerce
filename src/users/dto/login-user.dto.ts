import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDTO {
    @ApiProperty({ description: 'E-mail do usuário', example: 'thiago@exemplo.com' })
    email: string;

    @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
    password: string;
}