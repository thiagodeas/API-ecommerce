import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/users/schemas/user.schema';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    @ApiOperation({ summary: 'Lista todos os produtos (Acesso restrito a ADMIN)' })
    @ApiResponse( {status: 200, description: 'Produtos listados com sucesso.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    async findAllProducts() {
        return this.productsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Cria um novo produto (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos para criação do produto.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiBody({ type: CreateProductDTO })
    async createProduct(@Body() createProductDTO: CreateProductDTO) {
        return this.productsService.createProduct(createProductDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Busca um produto pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Produto encontrado.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID do produto a ser buscado' })
    async findProductById(@Param('id') id: string) {
        return this.productsService.findProductById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get('category/:id')
    @ApiOperation({ summary: 'Lista produtos de uma categoria específica (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Produtos da categoria retornados com sucesso.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada ou sem produtos.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    async findProductsByCategoryId(@Param('id') id: string) {
        return this.productsService.findProductsByCategory(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza um produto pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos para atualização.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID do produto a ser atualizado' })
    @ApiBody({ type: UpdateProductDTO })
    async updateProduct(@Param('id') id: string, @Body() updateProductDTO: UpdateProductDTO) {
        return this.productsService.updateProduct(id, updateProductDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Deleta um produto pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Produto deletado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID do produto a ser deletado' })
    async deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(id);
    }

}
