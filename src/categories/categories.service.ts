import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { parseId } from 'src/utils/parse-id.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/categories.schema';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

    async findAll(): Promise<{ categories: Category[] }> {
        const categories = await this.categoryModel.find().populate('products').exec();

        return { categories: categories.map(category => category.toObject({ versionKey: false })) };
    }

    async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<{category: Category}> {
        const existingCategory = await this.categoryModel.findOne({ name: createCategoryDTO.name }).exec();

        if (existingCategory) {
            throw new ConflictException('Já existe uma categoria com este nome.');
        }

        const category = await this.categoryModel.create(createCategoryDTO);

        return { category: category.toObject({ versionKey: false }) };
    }

    async findCategoryById(id: string): Promise<{category: Category}> {
        const categoryId = parseId(id);
        
        const category = await this.categoryModel.findById(categoryId).populate('products').exec();

        if (!category) {
            throw new NotFoundException('Categoria não encontrada.');
        }

        return { category: category.toObject({ versionKey: false }) };
    }

    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<{updatedCategory: Category}> {
        const categoryId = parseId(id);

        const updatedCategory = await this.categoryModel.findByIdAndUpdate(categoryId, data, { new: true }).exec();

        if (!updatedCategory) {
            throw new NotFoundException('Categoria não encontrada.');
        }
        return { updatedCategory: updatedCategory.toObject({ versionKey: false }) };
    }

    async deleteCategory(id: string) {
        const categoryId = parseId(id);

        const category = await this.categoryModel.findByIdAndDelete(categoryId).exec();

        if (!category) {
            throw new NotFoundException('Categoria não encontrada.');
        }
    }
}
