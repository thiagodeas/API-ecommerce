import { CreateUserDTO } from './dto/create-user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { parseId } from 'src/utils/parse-id.util';

@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService) {}

    async findAll(): Promise<{users: UserResponseDTO[]}>{
        const users = await this.prisma.user.findMany();
        return { users: plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true }) };
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
        if (!email) return null;
        
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserById (id: string): Promise<{user: UserResponseDTO}> {
        const userId = parseId(id);

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return {user: plainToInstance(UserResponseDTO, user)};
    }

    async updateUser (id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const userId = parseId(id)

        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        })

        return plainToInstance(UserResponseDTO, user);
    }

    async deleteUser (id: string) {
        const userId = parseId(id);

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
