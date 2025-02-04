import { CreateUserDTO } from './dto/create-user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async createUser (usr: CreateUserDTO): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                name: usr.name,
                email: usr.email,
                password: usr.password,
                role: usr.role || Role.USER,
            },
        });

        return user;
    }

    async findUserByEmail (email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserById (id: string): Promise<User | null> {
        const userId = Number(id);

        if (isNaN(userId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return user;
    }

    async deleteUser (id: string) {
        const userId = Number(id);

        if (isNaN(userId)) {
            throw new BadRequestException('O ID fornecido não é um número válido.');
        }

        try {
            await this.prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Usuário não encontrado.');
            }
            throw error;
        }
    }

    async comparePassword (providedPassword: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compare(providedPassword, storedPassword);
    }
}
