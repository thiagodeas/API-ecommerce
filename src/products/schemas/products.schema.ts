import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number; 

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categoryId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl?: string;  
}

export const ProductSchema = SchemaFactory.createForClass(Product);
