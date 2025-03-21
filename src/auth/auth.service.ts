import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
) {}

async login (loginUserDto: LoginUserDTO): Promise<{ user: UserResponseDTO, accessToken: string }> {
    if (!loginUserDto.email || !loginUserDto.password) {
        throw new BadRequestException('E-mail e senha são obrigatórios.');
    }


    const user = await this.usersService.findUserByEmail(loginUserDto.email);
    if (!user) {
        throw new NotFoundException('Usuário não encontrado!');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestException('Senha inválida!');
    }

    const payload: JwtPayload = { userId: (user._id as any).toString(), email: user.email};

    const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { user: plainToInstance(UserResponseDTO, user.toObject()), accessToken}
}

async register (usr: CreateUserDTO): Promise<{ user: UserResponseDTO }> {
    const existingUser = await this.usersService.findUserByEmail(usr.email);
    if (existingUser) {
        throw new BadRequestException('Email já está em uso!');
    }

    if (usr.password.length < 6) {
        throw new BadRequestException('A senha deve conter no mínimo 6 caracteres.');
    }

    const hashedPassword = await bcrypt.hash(usr.password, 10);

    const user = await this.usersService.createUser({
        email: usr.email,
        name: usr.name,
        password: hashedPassword,
    });

    return { user: plainToInstance(UserResponseDTO, user) };
}   

async validateUserByJwt(payload: JwtPayload) {
    const userId = String(payload.userId);

    const user = await this.usersService.findUserById(userId);
    return user || null;
}
}
