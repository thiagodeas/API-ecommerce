import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { parseId } from 'src/utils/parse-id.util';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<{categories: Category[]}> {
        const categories = await this.prisma.category.findMany();

        return { categories };
    }

    async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<{category: Category}> {
        const newCategory = await this.prisma.category.findFirst({
            where: {name: createCategoryDTO.name},
        });

        if (newCategory) {
            throw new ConflictException('Já existe uma categoria com este nome.');
        }

        const category = await this.prisma.category.create({
            data: createCategoryDTO,
        });

        return { category };
    }

    async findCategoryById(id: string): Promise<{category: Category}> {
        const categoryId = parseId(id);
        
        const category = await this.prisma.category.findUnique({
            where: {id: categoryId},
        });

        if (!category) {
            throw new NotFoundException('Categoria não encontrada.');
        }

        return { category };
    }

    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<{updatedCategory: Category}> {
        const categoryId = parseId(id);

        const updatedCategory = await this.prisma.category.update({
            where: { id: categoryId },
            data: data,
        });

        return { updatedCategory };
    }

    async deleteCategory(id: string) {
        const categoryId = parseId(id);

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
