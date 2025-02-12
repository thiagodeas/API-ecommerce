import { Product } from "@prisma/client";

export class CartItemResponseDTO {
    productId: number;
    quantity: number;
    subtotal: number;

    product: Product;
}

export class CartResponseDTO {
    id: number;
    userId: number;
    items: CartItemResponseDTO[];
    total: number;
}