import { CreateUserDTO } from './dto/create-user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDTO } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { parseId } from 'src/utils/parse-id.util';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserResponseDTO } from 'src/users/dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor (@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async findAll(): Promise<{users: UserResponseDTO[]}>{
        const users = await this.userModel.find().exec();
        
        return { users: plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true })};
    }

    async createUser (usr: CreateUserDTO): Promise<User> {
        const createdUser = new this.userModel({
            name: usr.name,
            email: usr.email,
            password: usr.password,
            role: Role.USER,
        });

        await createdUser.save();

        return createdUser.toObject();
    }

    async findUserByEmail (email: string): Promise<UserDocument | null> {
        if (!email) return null;

        return this.userModel.findOne({ email }).exec();
    }

    async findUserById (id: string): Promise<{user: UserResponseDTO}> {
        const userId = parseId(id);

        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return { user: plainToInstance(UserResponseDTO, user, {excludeExtraneousValues: true}) };
    }

    async updateUser (id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
        const userId = parseId(id)
        
        if (data.password) {
            if (data.password.length < 6) {
                throw new BadRequestException('A senha deve conter no mínimo 6 caracteres.');
            }
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, {
            new: true,
        }).exec();

        if (!updatedUser) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return plainToInstance(UserResponseDTO, updatedUser, {excludeExtraneousValues: true });
    }

    async deleteUser (id: string) {
        const userId = parseId(id);

        try {
            await this.userModel.findByIdAndDelete(userId).exec();
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
