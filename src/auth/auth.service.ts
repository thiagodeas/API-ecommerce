import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
) {}

async login (loginUserDto: LoginUserDTO) {
    const user = await this.usersService.findUserByEmail(loginUserDto.email);
    if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Senha inválida!');
    }

    const payload: JwtPayload = {userId: user.id, email: user.email};

    const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return {user, accessToken};
}

async register (usr: CreateUserDTO): Promise<{ user: User }> {
    const existingUser = await this.usersService.findUserByEmail(usr.email);
    if (existingUser) {
        throw new BadRequestException('Email já está em uso!');
    }

    const hashedPassword = await bcrypt.hash(usr.password, 10);

    const user = await this.usersService.createUser({
        ...usr,
        password: hashedPassword,
    });

    return { user };
}

async validateUserByJwt(payload: JwtPayload) {
    const userId = String(payload.userId);

    const user = await this.usersService.findUserById(userId);
    return user || null;
}

}
