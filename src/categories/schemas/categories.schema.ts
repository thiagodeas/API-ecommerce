import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/products/schemas/products.schema';
import { Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  products: Product[]; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
