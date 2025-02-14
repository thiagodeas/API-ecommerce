import { CartItem, Product } from "@prisma/client";
import { Expose, Type } from "class-transformer";

export class CartItemResponseDTO {
    @Expose()
    productId: number;

    @Expose()
    productName: string;

    @Expose()
    price: number;

    @Expose()
    quantity: number;

    @Expose()
    subtotal: number;

}

export class CartResponseDTO {
    @Expose()
    id: number;

    @Expose()
    userId: number;

    @Expose()
    total: number;

    @Expose()
    @Type(() => CartItemResponseDTO)
    items: CartItemResponseDTO[];

}