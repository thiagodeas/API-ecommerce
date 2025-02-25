import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/products.schema';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
    ]),
    CategoriesModule
],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), ProductsService],
})
export class ProductsModule {}
