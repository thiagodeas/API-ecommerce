import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type CartItemDodument = CartItem & Document;

@Schema()
export class CartItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cart', required: true})
    cartId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
    productId: MongooseSchema.Types.ObjectId;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({ default: 0 })
    subtotal: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem)
