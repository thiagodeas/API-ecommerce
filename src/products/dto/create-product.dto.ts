import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDTO {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    categoryId: number;
}