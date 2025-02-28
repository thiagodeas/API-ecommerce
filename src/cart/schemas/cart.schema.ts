import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Schema as MongooseSchema} from "mongoose";

export type CartDocument =  Cart & Document;

@Schema()
export class Cart {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ default: 0 })
    total: Number;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CartItem' }], default: [] })
    items: MongooseSchema.Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart)
