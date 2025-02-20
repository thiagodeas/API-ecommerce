import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDTO {
    @ApiProperty({ description: 'Novo nome do usuário', example: 'Thiago Sousa', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Novo e-mail do usuário', example: 'novoemail@exemplo.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'Nova senha (mínimo 6 caracteres)', example: 'novasenha123', required: false })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}