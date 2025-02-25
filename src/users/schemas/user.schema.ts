import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    _id: Types.ObjectId;

    @Prop({ required:  true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: Role, default: Role.USER })
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
