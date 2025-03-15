import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class RemoveItemFromCartDTO {
    @ApiProperty({ example: 1, description: "ID do produto a ser removido do carrinho." })
    @IsMongoId()
    productId: string;
}