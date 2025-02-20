import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class AddItemToCartDTO {
    @ApiProperty({ example: 1, description: "ID do produto a ser adicionado ao carrinho." })
    @IsInt()
    @IsPositive()
    productId: number;

    @ApiProperty({ example: 2, description: "Quantidade do produto a ser adicionada." })
    @IsInt()
    @IsPositive()
    quantity: number;

}