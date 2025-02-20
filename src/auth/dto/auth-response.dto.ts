import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDTO } from "src/users/dto/user-response.dto";

export class AuthResponseDTO {
    @ApiProperty({ description: 'Dados do usuário autenticado.' })
    user: UserResponseDTO;

    @ApiProperty({ description: 'Token JWT para autenticação.' })
    accessToken: string;
}