import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthRequest } from 'src/auth/auth-request.interface';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './schemas/user.schema';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService){}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    @ApiOperation({ summary: 'Lista todos os usuários (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Usuários listados com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    async findAllUsers () {
        return this.usersService.findAll();
    }

     @UseGuards(AuthGuard('jwt'))
     @Get('me')
     @ApiOperation({ summary: 'Fornece informações do usuário logado' })
     @ApiResponse({ status: 200, description: 'Informações obtidas com sucesso.' })
     @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido.' })
     async getMyProfile(@Request() req: AuthRequest) {
         return this.usersService.findUserById(String(req.user.id));
     }

     @UseGuards(AuthGuard('jwt'))
     @Patch('me')
     @ApiOperation({ summary: 'Atualiza dados do usuário logado' })
     @ApiResponse({ status: 200, description: 'Dados do usuário atualizado com sucesso.' })
     @ApiResponse({ status: 400, description: 'Dados inválidos.' })
     @ApiResponse({ status: 401, description: 'Token inválido ou não fornecido.' })
     @ApiBody({ type: UpdateUserDTO })
     async updateMyProfile(@Request() req: AuthRequest, @Body() updateUserDTO: UpdateUserDTO) {
        return this.usersService.updateUser(req.user.id.toString(), updateUserDTO);
     }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Busca um usuário pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    @ApiParam({ name: 'id', description: 'ID do usuário' })
    async findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Deleta um usuário pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    @ApiParam({ name: 'id', description: 'ID do usuário' })
    async deleteUserById(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
