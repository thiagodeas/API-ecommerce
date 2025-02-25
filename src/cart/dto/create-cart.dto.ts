import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class CreateCartDTO {
    @ApiProperty({ example: 42, description: "ID do usuário para quem o carrinho será criado." })
    @IsMongoId()
    userId: string;
}