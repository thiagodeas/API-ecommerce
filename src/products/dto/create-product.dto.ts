import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDTO {
    @IsString()
    @ApiProperty({ description: 'Nome do produto', example: 'Camiseta preta' })
    name: string;

    @IsString()
    @ApiProperty({ description: 'Descrição do produto', example: 'Camiseta de algodão tamanho M' })
    description: string;

    @IsNumber()
    @ApiProperty({ description: 'Preço do produto', example: 49.99 })
    price: number;

    @IsNumber()
    @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
    stock: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'URL da imagem do produto', example: 'https://imagem.com/produto.jpg', required: false })
    imageUrl?: string;

    @IsNumber()
    @ApiProperty({ description: 'ID da categoria do produto', example: 1 })
    categoryId: number;
}