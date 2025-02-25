import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
