import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @Post('login')
    async login (@Body() loginUserDto: LoginUserDTO) {
        return this.authService.login(loginUserDto);
    }
}
