import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService){}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAllUsers () {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}npx prisma generate

