import { Controller, Delete, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthRequest } from 'src/auth/auth-request.interface';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService){}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAllUsers () {
        return this.usersService.findAll();
    }

     @UseGuards(AuthGuard('jwt'))
     @Get('me')
     async getMyProfile(@Request() req: AuthRequest) {
 
         return this.usersService.findUserById(String(req.user.id));
     }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

   
}
