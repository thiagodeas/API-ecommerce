import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCartDTO } from './dto/create-cart.dto';
import { AddItemToCartDTO } from './dto/add-item-to-cart.dto';
import { RemoveItemFromCartDTO } from './dto/remove-item-from-cart.dto';

@Controller('carts')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    async createCart(@Body() createCartDTO: CreateCartDTO) {
        return this.cartService.createCart(createCartDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post(':cartId/items')
    async addItemToCart(@Param('cartId') cartId: string, @Body() addItemToCartDTO: AddItemToCartDTO) {
        return this.cartService.addItemToCart(cartId, addItemToCartDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':cartId/items')
    async removeItemFromCart(@Param('cartId') cartId: string, @Body() removeItemFromCartDTO: RemoveItemFromCartDTO) {
        return this.cartService.removeItemFromCart(cartId, removeItemFromCartDTO);
    }

    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
        return this.cartService.getCart(userId);
    }
}
