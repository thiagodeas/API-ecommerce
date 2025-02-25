import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { Role } from "../schemas/user.schema";
import { ObjectId } from 'mongodb';


export class UserResponseDTO {
    @ApiProperty({ description: 'ID do usuário', example: 1 })
    @Expose()
    id: string;

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
    
    @Exclude()
    __v: number;

    constructor (partial: Partial <any>) {
        Object.assign(this, partial);
        if (partial && partial._id) {
            this.id = (partial._id instanceof ObjectId) ? partial._id.toString() : partial._id;
        }
    }
}
