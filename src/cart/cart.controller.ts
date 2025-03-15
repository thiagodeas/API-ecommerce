import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO } from './dto/create-cart.dto';
import { AddItemToCartDTO } from './dto/add-item-to-cart.dto';
import { RemoveItemFromCartDTO } from './dto/remove-item-from-cart.dto';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('carts')
@Controller('carts')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @ApiOperation({ summary: 'Cria um carrinho para o usuário.'})
    @ApiResponse({ status: 201, description: 'Carrinho criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'O campo userId deve ser preenchido.' })
    @ApiResponse({ status: 409, description: 'O usuário já tem um carrinho.' })
    @ApiBody({ type: CreateCartDTO })
    async createCart(@Body() createCartDTO: CreateCartDTO) {
        return this.cartService.createCart(createCartDTO);
    }

    @Post(':cartId/items')
    @ApiOperation({ summary: 'Adiciona um item no carrinho.'})
    @ApiResponse({ status: 201, description: 'Item adicionado ao carrinho com sucesso.' })
    @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 404, description: 'Carrinho não encontrado.' })
    @ApiParam({ name: 'cartId', description: 'ID do carrinho' })
    @ApiBody({ type: AddItemToCartDTO })
    async addItemToCart(@Param('cartId') cartId: string, @Body() addItemToCartDTO: AddItemToCartDTO) {
        return this.cartService.addItemToCart(cartId, addItemToCartDTO);
    }

    @Delete(':cartId/items')
    @ApiOperation({ summary: 'Remove um item do carrinho.'})
    @ApiResponse({ status: 200, description: 'Item removido do carrinho com sucesso.' })
    @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
    @ApiResponse({ status: 404, description: 'Item não encontrado no carrinho.' })
    @ApiResponse({ status: 404, description: 'Carrinho não encontrado.' })
    @ApiParam({ name: 'cartId', description: 'ID do carrinho' })
    @ApiBody({ type: RemoveItemFromCartDTO })
    async removeItemFromCart(@Param('cartId') cartId: string, @Body() removeItemFromCartDTO: RemoveItemFromCartDTO) {
        return this.cartService.removeItemFromCart(cartId, removeItemFromCartDTO);
    }

    @Delete(':cartId')
    @ApiOperation({ summary: 'Exclui o carrinho.' })
    @ApiResponse({ status: 200, description: 'Carrinho excluído com sucesso.' })
    @ApiResponse({ status: 404, description: 'Carrinho não encontrado.' })
    @ApiParam({ name: 'cartId', description: 'ID do carrinho' })
    async deleteCart(@Param('cartId') cartId: string) {
        return this.cartService.deleteCart(cartId);
    }
    
    @Get(':userId')
    @ApiOperation({ summary: 'Lista todos os itens do carrinho do usuário.'})
    @ApiResponse({ status: 200, description: 'Itens listados com sucesso.' })
    @ApiResponse({ status: 400, description: 'Parâmetro inválido.' })
    @ApiResponse({ status: 404, description: 'Carrinho não encontrado.' })
    @ApiParam({ name: 'userId', description: 'ID do usuário' })
    async getCart(@Param('userId') userId: string) {
        return this.cartService.getCart(userId);
    }
}
