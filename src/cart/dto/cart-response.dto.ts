import { CartItem, Product } from "@prisma/client";

export class CartItemResponseDTO {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;

    constructor(cartItem: CartItem & { product: Product }) {
        this.productId = cartItem.product.id;
        this.productName = cartItem.product.name;
        this.price = cartItem.product.price;
        this.quantity = cartItem.quantity;
        this.subtotal = Number((cartItem.quantity * cartItem.product.price).toFixed(2));
    }
}

export class CartResponseDTO {
    id: number;
    userId: number;
    items: CartItemResponseDTO[];
    total: number;

    constructor(cart: { id: number; userId: number; items: (CartItem & { product: Product })[] }) {
        this.id = cart.id;
        this.userId = cart.userId;
        this.items = cart.items.map((item) => new CartItemResponseDTO(item));
        this.total = Number(this.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    }
}