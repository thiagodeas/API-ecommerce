import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDTO } from './dto/create-cart.dto';
import { AddItemToCartDTO } from './dto/add-item-to-cart.dto';
import { RemoveItemFromCartDTO } from './dto/remove-item-from-cart.dto';
import { CartItemResponseDTO, CartResponseDTO } from './dto/cart-response.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async createCart(createCartDTO: CreateCartDTO): Promise<Cart> {
        return this.prisma.cart.create({
            data: { userId: createCartDTO.userId },
        });
    }

    async addItemToCart(cartId: number, addItemToCartDTO: AddItemToCartDTO): Promise<CartItem> {
        const productExists = await this.prisma.product.findUnique({
            where: { id: addItemToCartDTO.productId },
        });

        if (!productExists) {
            throw new NotFoundException('Produto não encontrado.');
        }

        const cartItem: Prisma.CartItemCreateInput = {
            cart: { connect: { id: cartId } },
            product: { connect: { id: addItemToCartDTO.productId } },
            quantity: addItemToCartDTO.quantity,
        };

        return this.prisma.cartItem.create ({
            data: cartItem,
        });
    }

    async removeItemFromCart(cartId: number, removeItemFromCartDTO: RemoveItemFromCartDTO): Promise<void> {
        try {
            const cartItem = await this.prisma.cartItem.findFirst({
                where: { cartId, productId: removeItemFromCartDTO.productId },
            });

            if (!cartItem) {
                throw new NotFoundException('Item não encontrado no carrinho.');
            }

            await this.prisma.cartItem.delete({
                where: { id: cartItem.id },
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            } else {
                throw new Error('Erro ao remover o item do carrinho');
            }
        }
    }

    async getCart(userId: number): Promise<CartResponseDTO | null> {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            return null;
        }

        const items: CartItemResponseDTO[] = cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.quantity * item.product.price,
            product: item.product,
        }));

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        return {
            id: cart.id,
            userId: cart.userId,
            items,
            total,
        };
    }
}

