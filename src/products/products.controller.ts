import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAllProducts() {
        return this.productsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async createProduct(@Body() createProductDTO: CreateProductDTO) {
        return this.productsService.createProduct(createProductDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    async findProductById(@Param('id') id: string) {
        return this.productsService.findProductById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get('category/:id')
    async findProductsByCategoryId(@Param('id') id: string) {
        return this.productsService.findProductsByCategory(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateProduct(@Param('id') id: string, @Body() updateProductDTO: UpdateProductDTO) {
        return this.productsService.updateProduct(id, updateProductDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(id);
    }

}
