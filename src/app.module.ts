import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || (() => { throw new Error('MONGODB_URI não está definida nas variáveis de ambiente.');
   })()
   ),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, AuthService, ProductsService],
})
export class AppModule {}
