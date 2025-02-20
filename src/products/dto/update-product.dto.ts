import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Nome do produto', example: 'Camiseta preta', required: false })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Descrição do produto', example: 'Camiseta de algodão tamanho M', required: false })
    description?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Preço do produto', example: 49.99, required: false })
    price?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Quantidade em estoque', example: 100, required: false })
    stock?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'URL da imagem do produto', example: 'https://imagem.com/produto.jpg', required: false })
    imageUrl?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'ID da categoria do produto', example: 1, required: false })
    categoryId?: number;
}