import { CreateUserDTO } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService) {}

    async findAll(): Promise<User []> {
        return this.prisma.user.findMany();
    }

    async createUser(usr: CreateUserDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(usr.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: usr.name,
                email: usr.email,
                password: hashedPassword,
            },
        });

        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where:{
                id,
            },
        });
    }

    async comparePassword(providedPassword: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compare(providedPassword, storedPassword);
    }
}
