import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class UserResponseDTO {
    @ApiProperty({ description: 'ID do usuário', example: 1 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Nome do usuário', example: 'Thiago Sousa' })
    @Expose()
    name: string;

    @ApiProperty({ description: 'E-mail do usuário', example: 'thiago@exemplo.com' })
    @Expose()
    email: string;

    @ApiProperty({ description: 'Data de criação do usuário', example: '2025-02-20T12:34:56Z' })
    @Expose()
    createdAt: Date;

    @ApiProperty({ description: 'Data da última atualização do usuário', example: '2025-02-20T12:34:56Z' })
    @Expose()
    updatedAt: Date;

    @Exclude()
    password: string;

    @ApiProperty({ description: 'Papel do usuário', enum: Role })
    @Expose()
    role: Role;

    constructor (partial: Partial<UserResponseDTO>) {
        Object.assign(this, partial);
    }
}
