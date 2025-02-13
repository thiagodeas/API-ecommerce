import { BadRequestException } from "@nestjs/common";

export function parseId(id: string): number {
    const convertedId = Number(id);

    if(isNaN(convertedId)) {
        throw new BadRequestException('O ID fornecido não é um número válido.');
    }

    return convertedId;
}