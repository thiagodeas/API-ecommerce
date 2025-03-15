import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDTO } from './dto/create-cart.dto';
import { AddItemToCartDTO } from './dto/add-item-to-cart.dto';
import { RemoveItemFromCartDTO } from './dto/remove-item-from-cart.dto';
import { CartItemResponseDTO, CartResponseDTO } from './dto/cart-response.dto';
import { parseId } from 'src/utils/parse-id.util';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem, CartItemDodument } from './schemas/cart-item.schema';
import { Product, ProductDocument } from 'src/products/schemas/products.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItemDodument>
    ) {}

    async createCart(createCartDTO: CreateCartDTO): Promise<{cart: Cart}> {
        const { userId } = createCartDTO;

        if (!userId) {
            throw new BadRequestException('O campo userID deve ser preenchido.');
        }

        const existingCart = await this.cartModel.findOne({ userId }).exec();

        if (existingCart) {
            throw new ConflictException('O usuário já tem um carrinho.');
        }

        const cart = await this.cartModel.create(createCartDTO);

        return { cart: cart.toObject({ versionKey: false }) };
    }

    async addItemToCart(id: string, addItemToCartDTO: AddItemToCartDTO): Promise<CartItem> {
        const cartId = parseId(id);

        const cart = await this.cartModel.findById(cartId).exec();

        if (!cart) {
            throw new NotFoundException('Carrinho não encontrado.');
        }

        let productId = addItemToCartDTO.productId;

        if (typeof productId === 'number') {
            throw new BadRequestException('O ID do produto não deve ser um número. Deve ser um ObjectID válido.');
        }

        const product = await this.productModel.findById(addItemToCartDTO.productId).exec();

        if (!product) {
            throw new NotFoundException('Produto não encontrado.');
        }

        let cartItem = await this.cartItemModel.findOne({ cartId: cart._id, productId: product._id }).exec();

        if (cartItem) {
            cartItem.quantity += addItemToCartDTO.quantity;
            cartItem.subtotal = parseFloat((cartItem.quantity * product.price).toFixed(2));
            
            await cartItem.save();
        } else {
            const subtotal = parseFloat((product.price * addItemToCartDTO.quantity).toFixed(2));

            cartItem = await this.cartItemModel.create({
            cartId: cart._id,
            productId: product._id,
            quantity: addItemToCartDTO.quantity,
            subtotal,
        });
        
            await this.cartModel.updateOne({_id: cart.id}, {$push: { items: cartItem._id}});
        }

        await this.updateCartTotal(cart._id.toString());

        return cartItem.toObject({ versionKey: false });
    }

    async updateCartTotal(cartId: number | string): Promise<void> {
        const cartItems = await this.cartItemModel.find({ cartId }).exec();

        const total = parseFloat(cartItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

        await this.cartModel.findByIdAndUpdate(cartId, { total }).exec();
    }

    async removeItemFromCart(id: string, removeItemFromCartDTO: RemoveItemFromCartDTO): Promise<void> {
            const cartId = parseId(id);

            const cart = await this.cartModel.findById(id).exec();

            if (!cart) {
                throw new NotFoundException('Carrinho não encontrado.');
            }

            const cartItem = await this.cartItemModel.findOne({ cartId: cart._id,
                productId: removeItemFromCartDTO.productId
              }).populate('productId').exec();

            if (!cartItem) {
                throw new NotFoundException('Item não encontrado no carrinho.');
            }

             if (cartItem.quantity === 1) {
                await cartItem.deleteOne();
                await cart.save();
            } else {
                cartItem.quantity -= 1;
                const product = await this.productModel.findById(cartItem.productId).exec();
                if (!product) {
                    throw new NotFoundException('Produto não encontrado.');
                }
                cartItem.subtotal = parseFloat((cartItem.quantity * product.price).toFixed(2));
                await cartItem.save();
            }

            await this.updateCartTotal(cart._id.toString());
    }

    async getCart(id: string): Promise<CartResponseDTO | null> {
        const userId = parseId(id);
        
        const cart = await this.cartModel.findOne({ userId })
        .populate({
            path: 'items',
            populate: {
              path: 'productId',
              model: 'Product',
            },
        })
        .exec();

        if (!cart) return null;

        const items = cart.items.map((item: any) => ({
            productId: item.productId._id.toString(),
            productName: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            subtotal: parseFloat((item.quantity * item.productId.price).toFixed(2)),
        }));

        return plainToInstance(CartResponseDTO, {
            id: cart._id.toString(),
            userId: cart.userId.toString(),
            items: plainToInstance(CartItemResponseDTO, items),
            total: parseFloat(cart.total.toFixed(2)),
        });
    }

    async deleteCart(id: string): Promise<void> {
        const cartId = parseId(id);
    
        const cart = await this.cartModel.findById(cartId).exec();
    
        if (!cart) {
            throw new NotFoundException('Carrinho não encontrado.');
        }
        
        await this.cartItemModel.deleteMany({ cartId: cart._id }).exec();
    
        await this.cartModel.findByIdAndDelete(cartId).exec();
    }
    
}
