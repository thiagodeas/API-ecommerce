import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDTO } from './dto/create-cart.dto';
import { AddItemToCartDTO } from './dto/add-item-to-cart.dto';
import { RemoveItemFromCartDTO } from './dto/remove-item-from-cart.dto';
import { CartItemResponseDTO, CartResponseDTO } from './dto/cart-response.dto';
import { parseId } from 'src/utils/parse-id.util';

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

        const cartItem: Prisma.CartItemCreateInput = {
            cart: { connect: { id: cartId } },
            product: { connect: { id: addItemToCartDTO.productId } },
            quantity: addItemToCartDTO.quantity,
        };

        return this.prisma.cartItem.create ({
            data: cartItem,
        });
    }

    async removeItemFromCart(id: string, removeItemFromCartDTO: RemoveItemFromCartDTO): Promise<void> {
        try {
            const cartId = parseId(id);
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

        if (!cart) {
            return null;
        }

        return new CartResponseDTO(cart);
    }
}

