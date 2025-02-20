import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDTO {
    @ApiProperty({ example: "Roupas", description: "Novo nome da categoria.", required: false })
    @IsString()
    @IsOptional()
    name?: string;
}