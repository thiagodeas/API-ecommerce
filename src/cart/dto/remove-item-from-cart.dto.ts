import { IsInt, IsPositive } from "class-validator";

export class RemoveItemFromCartDTO {
    @IsInt()
    @IsPositive()
    productId: number;
}