import { IsInt, IsPositive } from "class-validator";

export class AddItemToCartDTO {
    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @IsPositive()
    quantity: number;

}