import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDTO } from './dto/update-product.dto';
import { parseId } from 'src/utils/parse-id.util';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<{products: Product[]}> {
        const products = await this.prisma.product.findMany();
        return {products};
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<{product: Product}> {
        const newProduct = await this.prisma.product.findFirst({
            where: { name: createProductDTO.name },
        });

        if (newProduct) {
            throw new ConflictException('Já existe um produto com este nome.');
        }

        const product = await this.prisma.product.create({
            data: createProductDTO,
        });

        return { product };
    }

    async findProductById(id: string): Promise<{product: Product}> {
        const productId = parseId(id);

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

    async findProductsByCategory(id: string): Promise<{ products: Product[] }> {
        const categoryId = parseId(id);

        const products = await this.prisma.product.findMany({
            where: { categoryId },
        });

        return { products };
    }

    async updateProduct(id: string, data: UpdateProductDTO): Promise<{updatedProduct: Product}> {
        const productId = parseId(id);

        const updatedProduct = await this.prisma.product.update({
            where: {id: productId},
            data,
        });

        return {updatedProduct};
    }

    async deleteProduct(id: string) {
        const productId = parseId(id);
        
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
