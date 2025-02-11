import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<{categories: Category[]}> {
        const categories = await this.prisma.category.findMany();

        return { categories };
    }

    async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<{category: Category}> {
        const category = await this.prisma.category.create({
            data: createCategoryDTO,
        });

        return { category };
    }

    async findCategoryById(id: string): Promise<{category: Category}> {
        const categoryId = Number(id);
        
        if (isNaN(categoryId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        const category = await this.prisma.category.findUnique({
            where: {id: categoryId},
        });

        if (!category) {
            throw new NotFoundException('Categoria não encontrada.');
        }

        return { category };
    }

    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<{updatedCategory: Category}> {
        const categoryId = Number(id);
        
        if (isNaN(categoryId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        const updatedCategory = await this.prisma.category.update({
            where: { id: categoryId },
            data: data,
        });

        return { updatedCategory };
    }

    async deleteCategory(id: string) {
        const categoryId = Number(id);

        if (isNaN(categoryId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        try {
            await this.prisma.category.delete({
                where: {
                    id: categoryId,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Categoria não encontrada.');
            }
            throw error;
        }
    }
}
