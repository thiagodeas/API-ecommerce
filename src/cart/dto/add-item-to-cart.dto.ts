import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsMongoId, IsPositive } from "class-validator";

export class AddItemToCartDTO {
    @ApiProperty({ example: "615a1f1d7f1e2c00123abcde", description: "ID do produto a ser adicionado ao carrinho." })
    @IsMongoId()
    productId: string;

    @ApiProperty({ example: 2, description: "Quantidade do produto a ser adicionada." })
    @IsInt()
    @IsPositive()
    quantity: number;
}