import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @Post('register')
    async register (@Body() createUserDto: CreateUserDTO) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login (@Body() loginUserDto: LoginUserDTO) {
        return this.authService.login(loginUserDto);
    }
    
}
