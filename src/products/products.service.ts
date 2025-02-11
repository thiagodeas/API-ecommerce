import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<{products: Product[]}> {
        const products = await this.prisma.product.findMany();
        return {products};
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<{product: Product}> {
        const product = await this.prisma.product.create({
            data: createProductDTO,
        });

        return { product };
    }

    async findProductById(id: string): Promise<{product: Product}> {
        const productId = Number(id);

        if (isNaN(productId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        const product = await this.prisma.product.findUnique({
            where: {
                id: productId,
            }
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado.');
        }

        return {product};
    }

    async updateProduct(id: string, data: UpdateProductDTO): Promise<{updatedProduct: Product}> {
        const productId = Number(id);

        if (isNaN(productId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        const updatedProduct = await this.prisma.product.update({
            where: {id: productId},
            data,
        });

        return {updatedProduct};
    }

    async deleteProduct(id: string) {
        const productId = Number(id);

        if (isNaN(productId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        try {
            await this.prisma.product.delete({
                where: {
                    id: productId,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Produto não encontrado.');
            }
            throw error;
        }
    }
}
