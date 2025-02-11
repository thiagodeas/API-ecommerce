import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  providers: [CategoriesService, PrismaService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
