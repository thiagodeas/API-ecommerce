import { ApiProperty } from "@nestjs/swagger";

export class CreateCartDTO {
    @ApiProperty({ example: 42, description: "ID do usuário para quem o carrinho será criado." })
    userId: number
}