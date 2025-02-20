import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class RemoveItemFromCartDTO {
    @ApiProperty({ example: 1, description: "ID do produto a ser removido do carrinho." })
    @IsInt()
    @IsPositive()
    productId: number;
}