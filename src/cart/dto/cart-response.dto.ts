import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class CartItemResponseDTO {
    @ApiProperty({ example: "615a1f1d7f1e2c00123abcde", description: "ID do produto." })
    @Expose()
    productId: string;

    @ApiProperty({ example: "Tênis Nike Air", description: "Nome do produto." })
    @Expose()
    productName: string;

    @ApiProperty({ example: 199.99, description: "Preço unitário do produto." })
    @Expose()
    price: number;

    @ApiProperty({ example: 2, description: "Quantidade do produto no carrinho." })
    @Expose()
    quantity: number;

    @ApiProperty({ example: 399.98, description: "Subtotal do item (preço * quantidade)." })
    @Expose()
    subtotal: number;
}

export class CartResponseDTO {
    @ApiProperty({ example: "615a1f1d7f1e2c00123abcf0", description: "ID do carrinho." })
    @Expose()
    id: string;

    @ApiProperty({ example: "615a1f1d7f1e2c00123abc12", description: "ID do usuário dono do carrinho." })
    @Expose()
    userId: string;

    @ApiProperty({ example: 599.97, description: "Valor total do carrinho." })
    @Expose()
    total: number;

    @ApiProperty({ type: [CartItemResponseDTO], description: "Lista de itens do carrinho." })
    @Expose()
    @Type(() => CartItemResponseDTO)
    items: CartItemResponseDTO[];
}