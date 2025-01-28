import { Injectable } from '@nestjs/common';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
) {}

async login (loginUserDto: LoginUserDTO) {
    const user = await this.usersService.findUserByEmail(loginUserDto.email);
    if (!user) {
        throw new Error('Usuário não encontrado!');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida!');
    }

    const payload: JwtPayload = {userId: user.id, email: user.email};

    const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {user, accessToken};
}

async validateUserByJwt(payload: JwtPayload): Promise<User | null>{
    const user = await this.usersService.findUserById(payload.userId);
    return user || null;
}

}
