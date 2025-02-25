import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductsModule } from 'src/products/products.module';
import { CartItem, CartItemSchema } from './schemas/cart-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name,  schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    ProductsModule],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
