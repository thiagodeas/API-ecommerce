import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { parseId } from 'src/utils/parse-id.util';
import { Product, ProductDocument } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/categories/schemas/categories.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
    ) {}

    async findAll(): Promise<{ products: Product[] }> {
        const products = await this.productModel.find().exec();
        return { products: products.map(product => product.toObject({ versionKey: false })) };
    }

    async createProduct(createProductDTO: CreateProductDTO): Promise<{product: Product}> {
        const existingProduct = await this.productModel.findOne({ name: createProductDTO.name }).exec();

        if (existingProduct) {
            throw new ConflictException('Já existe um produto com este nome.');
        }

        const categoryExists = await this.categoryModel.findById(createProductDTO.categoryId)
        if (!categoryExists) {
            throw new NotFoundException('Categoria não encontrada.');
        }
        const product = new this.productModel(createProductDTO);
        await product.save();

        await this.categoryModel.findByIdAndUpdate(
            createProductDTO.categoryId,
            { $push: { products: product._id } },
            { new: true }  
        ).exec()

        return { product: product.toObject({ versionKey: false }) };
    }

    async findProductById(id: string): Promise<{product: Product}> {
        const productId = parseId(id);

        const product = await this.productModel.findById(productId).exec();

        if (!product) {
            throw new NotFoundException('Produto não encontrado.');
        }

        return { product: product.toObject({ versionKey: false }) };
    }

    async findProductsByCategory(id: string): Promise<{ products: Product[] }> {
        const categoryId = parseId(id);

        const products = await this.productModel.find({ categoryId }).exec();

        return { products: products.map(product => product.toObject({ versionKey: false })) };
    }

    async updateProduct(id: string, data: UpdateProductDTO): Promise<{updatedProduct: Product}> {
        const productId = parseId(id);

        const updatedProduct = await this.productModel.findByIdAndUpdate(productId, data, { new: true }).exec();

        if (!updatedProduct) {
            throw new NotFoundException('Produto não encontrado.');
        }

        return { updatedProduct: updatedProduct.toObject({ versionKey: false }) };
    }

    async deleteProduct(id: string): Promise<void> {
        const productId = parseId(id);
        
        try {
            await this.productModel.findByIdAndDelete(productId).exec();
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Produto não encontrado.');
            }
            throw error;
        }
    }
}
