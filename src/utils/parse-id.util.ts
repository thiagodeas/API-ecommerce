import { BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

export function parseId(id: string): string {
    if (Types.ObjectId.isValid(id)) {
        return id;
    }
    
    throw new BadRequestException('O ID fornecido não é válido.');
}
