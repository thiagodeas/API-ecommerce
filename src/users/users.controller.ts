import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService){}

    @Get()
    async getUsers() {
        return this.usersService.findAll();
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDTO) {
        return this.usersService.createUser(createUserDto);
    }

}
