import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDTO } from 'src/users/dto/user-response.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @Post('register')
    @ApiOperation({ summary: 'Cria uma conta para o usuário.'})
    @ApiBody({ type: CreateUserDTO })
    @ApiResponse({ status: 201, description: 'Conta criada com sucesso.', type: UserResponseDTO })
    @ApiResponse({ status: 400, description: 'E-mail já está em uso.' })
    async register (@Body() createUserDto: CreateUserDTO) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Autentica o usuário e retorna um token JWT.' })
    @ApiBody({ type: LoginUserDTO })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso.', type: AuthResponseDTO })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    @ApiResponse({ status: 401, description: 'Senha inválida.' })
    async login (@Body() loginUserDto: LoginUserDTO) {
        return this.authService.login(loginUserDto);
    }
    
}
