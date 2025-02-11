import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [],
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
