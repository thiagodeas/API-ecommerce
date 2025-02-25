import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Schema as MongooseSchema} from "mongoose";
import { CartItem } from "./cart-item.schema";

export type CartDocument =  Cart & Document;

@Schema()
export class Cart {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ default: 0 })
    total: Number;

    @Prop()
    items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart)
