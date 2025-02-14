import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDTO } from './dto/create-cart.dto';
import { AddItemToCartDTO } from './dto/add-item-to-cart.dto';
import { RemoveItemFromCartDTO } from './dto/remove-item-from-cart.dto';
import { CartItemResponseDTO, CartResponseDTO } from './dto/cart-response.dto';
import { parseId } from 'src/utils/parse-id.util';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async createCart(createCartDTO: CreateCartDTO): Promise<{cart: Cart}> {

        if (!createCartDTO.userId) {
            throw new BadRequestException('O campo userID deve ser preenchido.');
        }

        const existingCart = await this.prisma.cart.findUnique({
            where: { userId: createCartDTO.userId },
        });

        if (existingCart) {
            throw new ConflictException('O usuário já tem um carrinho.');
        }


        const cart =  await this.prisma.cart.create({
            data: { userId: createCartDTO.userId },
        });

        return { cart };
    }

    async addItemToCart(id: string, addItemToCartDTO: AddItemToCartDTO): Promise<CartItem> {
        const cartId = parseId(id);

        const productExists = await this.prisma.product.findUnique({
            where: { id: addItemToCartDTO.productId },
        });

        if (!productExists) {
            throw new NotFoundException('Produto não encontrado.');
        }

        const subtotal = productExists.price * addItemToCartDTO.quantity;

        const cartItem: Prisma.CartItemCreateInput = {
            cart: { connect: { id: cartId } },
            product: { connect: { id: addItemToCartDTO.productId } },
            quantity: addItemToCartDTO.quantity,
            subtotal,
        };

        const createdCartItem = await this.prisma.cartItem.create ({
            data: cartItem,
        });

        await this.updateCartTotal(cartId);

        return createdCartItem;
    }

    async updateCartTotal(cartId: number): Promise<void> {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { cartId },
        });

        const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

        await this.prisma.cart.update({
            where: { id: cartId },
            data: {
                total,
            },
        });
    }

    async removeItemFromCart(id: string, removeItemFromCartDTO: RemoveItemFromCartDTO): Promise<void> {
            const cartId = parseId(id);

            const cartItem = await this.prisma.cartItem.findFirst({
                where: { cartId, productId: removeItemFromCartDTO.productId },
                include: { product: true },
            });

            if (!cartItem) {
                throw new NotFoundException('Item não encontrado no carrinho.');
            }

             if (cartItem.quantity === 1) {
                await this.prisma.cartItem.delete({
                    where: { id: cartItem.id },
                });
                
            } else {
                await this.prisma.cartItem.update({
                    where: { id: cartItem.id},
                    data: {
                        quantity: cartItem.quantity - 1,
                    },
                });
            }

            const updatedCartItems = await this.prisma.cartItem.findMany({
                where: { cartId },
                include: { product: true },
            });

            const updatedTotal = updatedCartItems.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);

            await this.prisma.cart.update({
                where: { id: cartId },
                data: { total: updatedTotal },
            });
    }

    async getCart(id: string): Promise<CartResponseDTO | null> {

        const userId = parseId(id);
        
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                 },
            },
        });

        if (!cart) return null;

        const items = cart.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.quantity * item.product.price,
        }));

        const total = cart.total;

        return plainToInstance(CartResponseDTO, {
            id: cart.id,
            userId: cart.userId,
            items: plainToInstance(CartItemResponseDTO, items),
            total,
        });
    }
}
